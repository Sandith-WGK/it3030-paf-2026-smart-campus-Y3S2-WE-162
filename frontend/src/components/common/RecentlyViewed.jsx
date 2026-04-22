import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { Eye, Trash2, Clock, X, Loader2 } from 'lucide-react';

const RecentlyViewed = () => {
  const { recentlyViewed, loading, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
        <Loader2 size={20} className="animate-spin mx-auto text-gray-400" />
        <p className="text-xs text-gray-400 mt-2">Loading...</p>
      </div>
    );
  }

  if (recentlyViewed.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
          <Eye size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No recently viewed resources</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Resources you view will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-violet-500" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recently Viewed</h3>
          <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {recentlyViewed.length}
          </span>
        </div>
        <button onClick={clearRecentlyViewed} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
          <Trash2 size={12} /> Clear all
        </button>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {recentlyViewed.map((item, index) => (
          <Link
            key={item.id}
            to={`/resources/${item.resourceId}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div className="w-5">
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-500">{index + 1}</span>
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
              <span className="text-sm">
                {item.resourceType === 'HALL' && '🏛️'}
                {item.resourceType === 'LAB' && '🔬'}
                {item.resourceType === 'ROOM' && '🚪'}
                {item.resourceType === 'EQUIPMENT' && '🔧'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.resourceName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.resourceType} • {item.resourceLocation}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromRecentlyViewed(item.resourceId);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
              <X size={14} />
            </button>
          </Link>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Personal - only visible to your account</p>
      </div>
    </div>
  );
};

export default RecentlyViewed;