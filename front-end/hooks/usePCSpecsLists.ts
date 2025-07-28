import { useState, useEffect } from 'react';
import { 
  PCSpecsListCreate, 
  PCSpecsListUpdate, 
  PCSpecsListRead, 
  PCSpecsListsResponse 
} from '@/lib/pc-specs-lists-api';
import { 
  getPCSpecsLists, 
  getPCSpecsList, 
  createPCSpecsList, 
  updatePCSpecsList, 
  deletePCSpecsList 
} from '@/lib/pc-specs-lists-api';
import { useToast } from '@/hooks/use-toast';

export const usePCSpecsLists = () => {
  const [pcSpecsLists, setPCSpecsLists] = useState<PCSpecsListRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 10,
    has_more: false
  });
  const { toast } = useToast();

  const fetchPCSpecsLists = async (params?: {
    skip?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: PCSpecsListsResponse = await getPCSpecsLists(params);
      setPCSpecsLists(response.items);
      setPagination({
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        has_more: response.has_more
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch PC specs lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchPCSpecsList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const pcSpecsList = await getPCSpecsList(id);
      return pcSpecsList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch PC specs list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPCSpecsList = async (pcSpecsListData: PCSpecsListCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newPCSpecsList = await createPCSpecsList(pcSpecsListData);
      setPCSpecsLists(prev => [newPCSpecsList, ...prev]);
      toast({
        title: "Success",
        description: "PC specs list created successfully!",
      });
      return newPCSpecsList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create PC specs list';
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

  const editPCSpecsList = async (id: number, pcSpecsListData: PCSpecsListUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPCSpecsList = await updatePCSpecsList(id, pcSpecsListData);
      setPCSpecsLists(prev => prev.map(pcSpecsList => 
        pcSpecsList.id === id ? updatedPCSpecsList : pcSpecsList
      ));
      toast({
        title: "Success",
        description: "PC specs list updated successfully!",
      });
      return updatedPCSpecsList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PC specs list';
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

  const removePCSpecsList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePCSpecsList(id);
      setPCSpecsLists(prev => prev.filter(pcSpecsList => pcSpecsList.id !== id));
      toast({
        title: "Success",
        description: "PC specs list deleted successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete PC specs list';
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
      fetchPCSpecsLists({
        skip: pagination.skip + pagination.limit,
        limit: pagination.limit
      });
    }
  };

  return {
    pcSpecsLists,
    loading,
    error,
    pagination,
    fetchPCSpecsLists,
    fetchPCSpecsList,
    addPCSpecsList,
    editPCSpecsList,
    removePCSpecsList,
    loadMore
  };
}; 