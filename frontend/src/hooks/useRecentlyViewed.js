import { useState, useEffect, useCallback } from 'react';
import api from '../services/api/axios';

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecentlyViewed = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/recently-viewed');
      setRecentlyViewed(response.data || []);
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentlyViewed();
  }, [loadRecentlyViewed]);

  const addToRecentlyViewed = useCallback(async (resource) => {
    if (!resource || !resource.id) return;
    
    try {
      await api.post(`/recently-viewed/${resource.id}`);
      await loadRecentlyViewed();
    } catch (error) {
      console.error('Failed to add to recently viewed:', error);
    }
  }, [loadRecentlyViewed]);

  const clearRecentlyViewed = useCallback(async () => {
    try {
      await api.delete('/recently-viewed');
      await loadRecentlyViewed();
    } catch (error) {
      console.error('Failed to clear recently viewed:', error);
    }
  }, [loadRecentlyViewed]);

  const removeFromRecentlyViewed = useCallback(async (resourceId) => {
    try {
      await api.delete(`/recently-viewed/${resourceId}`);
      await loadRecentlyViewed();
    } catch (error) {
      console.error('Failed to remove from recently viewed:', error);
    }
  }, [loadRecentlyViewed]);

  return { 
    recentlyViewed, 
    loading,
    addToRecentlyViewed, 
    clearRecentlyViewed,
    removeFromRecentlyViewed 
  };
};