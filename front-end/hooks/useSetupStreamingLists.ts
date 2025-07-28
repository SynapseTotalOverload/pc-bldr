import { useState, useEffect } from 'react';
import { 
  SetupStreamingListCreate, 
  SetupStreamingListUpdate, 
  SetupStreamingListRead, 
  SetupStreamingListsResponse 
} from '@/lib/setup-streaming-lists-api';
import { 
  getSetupStreamingLists, 
  getSetupStreamingList, 
  createSetupStreamingList, 
  updateSetupStreamingList, 
  deleteSetupStreamingList 
} from '@/lib/setup-streaming-lists-api';
import { useToast } from '@/hooks/use-toast';

export const useSetupStreamingLists = () => {
  const [setupStreamingLists, setSetupStreamingLists] = useState<SetupStreamingListRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 10,
    has_more: false
  });
  const { toast } = useToast();

  const fetchSetupStreamingLists = async (params?: {
    skip?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: SetupStreamingListsResponse = await getSetupStreamingLists(params);
      setSetupStreamingLists(response.items);
      setPagination({
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        has_more: response.has_more
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch setup streaming lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchSetupStreamingList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const setupStreamingList = await getSetupStreamingList(id);
      return setupStreamingList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch setup streaming list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSetupStreamingList = async (setupStreamingListData: SetupStreamingListCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newSetupStreamingList = await createSetupStreamingList(setupStreamingListData);
      setSetupStreamingLists(prev => [newSetupStreamingList, ...prev]);
      toast({
        title: "Success",
        description: "Setup streaming list created successfully!",
      });
      return newSetupStreamingList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create setup streaming list';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editSetupStreamingList = async (id: number, setupStreamingListData: SetupStreamingListUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSetupStreamingList = await updateSetupStreamingList(id, setupStreamingListData);
      setSetupStreamingLists(prev => prev.map(setupStreamingList => 
        setupStreamingList.id === id ? updatedSetupStreamingList : setupStreamingList
      ));
      toast({
        title: "Success",
        description: "Setup streaming list updated successfully!",
      });
      return updatedSetupStreamingList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update setup streaming list';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSetupStreamingList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSetupStreamingList(id);
      setSetupStreamingLists(prev => prev.filter(setupStreamingList => setupStreamingList.id !== id));
      toast({
        title: "Success",
        description: "Setup streaming list deleted successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete setup streaming list';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.has_more) {
      fetchSetupStreamingLists({
        skip: pagination.skip + pagination.limit,
        limit: pagination.limit
      });
    }
  };

  return {
    setupStreamingLists,
    loading,
    error,
    pagination,
    fetchSetupStreamingLists,
    fetchSetupStreamingList,
    addSetupStreamingList,
    editSetupStreamingList,
    removeSetupStreamingList,
    loadMore
  };
}; 