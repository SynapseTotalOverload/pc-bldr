import { useState, useEffect } from 'react';
import { 
  PlayerCreate, 
  PlayerUpdate, 
  PlayerWithRelations, 
  PlayersResponse 
} from '@/types/players-base';
import { 
  getPlayers, 
  getPlayer, 
  createPlayer, 
  updatePlayerGear, 
  deletePlayer 
} from '@/lib/players-api';

export const usePlayers = () => {
  const [players, setPlayers] = useState<PlayerWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 10,
    has_more: false
  });

  const fetchPlayers = async (params?: {
    skip?: number;
    limit?: number;
    team?: string;
    country?: string;
    query?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response: PlayersResponse = await getPlayers(params);
      setPlayers(response.items);
      setPagination({
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        has_more: response.has_more
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayer = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const player = await getPlayer(id);
      return player;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (playerData: PlayerCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newPlayer = await createPlayer(playerData);
      setPlayers(prev => [newPlayer, ...prev]);
      return newPlayer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create player');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editPlayer = async (id: number, playerData: PlayerUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await updatePlayerGear(id, playerData);
      setPlayers(prev => prev.map(player => 
        player.id === id ? updatedPlayer : player
      ));
      return updatedPlayer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update player');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePlayer = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePlayer(id);
      setPlayers(prev => prev.filter(player => player.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.has_more) {
      fetchPlayers({
        skip: pagination.skip + pagination.limit,
        limit: pagination.limit
      });
    }
  };

  return {
    players,
    loading,
    error,
    pagination,
    fetchPlayers,
    fetchPlayer,
    addPlayer,
    editPlayer,
    removePlayer,
    loadMore
  };
}; 