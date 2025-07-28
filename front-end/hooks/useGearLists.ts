import { useState, useEffect } from 'react';
import { 
  GearListCreate, 
  GearListUpdate, 
  GearListRead, 
  GearListsResponse 
} from '@/lib/gear-lists-api';
import { 
  getGearLists, 
  getGearList, 
  createGearList, 
  updateGearList, 
  deleteGearList 
} from '@/lib/gear-lists-api';
import { useToast } from '@/hooks/use-toast';

export const useGearLists = () => {
  const [gearLists, setGearLists] = useState<GearListRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 10,
    has_more: false
  });
  const { toast } = useToast();

  const fetchGearLists = async (params?: {
    skip?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: GearListsResponse = await getGearLists(params);
      setGearLists(response.items);
      setPagination({
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        has_more: response.has_more
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gear lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchGearList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const gearList = await getGearList(id);
      return gearList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gear list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addGearList = async (gearListData: GearListCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newGearList = await createGearList(gearListData);
      setGearLists(prev => [newGearList, ...prev]);
      toast({
        title: "Success",
        description: "Gear list created successfully!",
      });
      return newGearList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gear list';
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

  const editGearList = async (id: number, gearListData: GearListUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGearList = await updateGearList(id, gearListData);
      setGearLists(prev => prev.map(gearList => 
        gearList.id === id ? updatedGearList : gearList
      ));
      toast({
        title: "Success",
        description: "Gear list updated successfully!",
      });
      return updatedGearList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gear list';
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

  const removeGearList = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteGearList(id);
      setGearLists(prev => prev.filter(gearList => gearList.id !== id));
      toast({
        title: "Success",
        description: "Gear list deleted successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gear list';
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
      fetchGearLists({
        skip: pagination.skip + pagination.limit,
        limit: pagination.limit
      });
    }
  };

  return {
    gearLists,
    loading,
    error,
    pagination,
    fetchGearLists,
    fetchGearList,
    addGearList,
    editGearList,
    removeGearList,
    loadMore
  };
}; 