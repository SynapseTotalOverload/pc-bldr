import { useState } from 'react';
import { PlayerWithRelations } from '@/types/players-base';
import { 
  addSkinToPlayer,
  removeSkinFromPlayer,
  addSkinsToPlayerBatch,
  removeSkinsFromPlayerBatch,
  setPlayerSkins
} from '@/lib/players-api';
import { useToast } from '@/hooks/use-toast';

export const usePlayerSkins = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const addSkin = async (playerId: number, skinId: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await addSkinToPlayer(playerId, skinId);
      toast({
        title: "Success",
        description: "Skin added to player successfully!",
      });
      return updatedPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add skin to player';
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

  const removeSkin = async (playerId: number, skinId: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await removeSkinFromPlayer(playerId, skinId);
      toast({
        title: "Success",
        description: "Skin removed from player successfully!",
      });
      return updatedPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove skin from player';
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

  const addSkinsBatch = async (playerId: number, skinIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await addSkinsToPlayerBatch(playerId, skinIds);
      toast({
        title: "Success",
        description: `${skinIds.length} skins added to player successfully!`,
      });
      return updatedPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add skins to player';
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

  const removeSkinsBatch = async (playerId: number, skinIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await removeSkinsFromPlayerBatch(playerId, skinIds);
      toast({
        title: "Success",
        description: `${skinIds.length} skins removed from player successfully!`,
      });
      return updatedPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove skins from player';
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

  const setSkins = async (playerId: number, skinIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlayer = await setPlayerSkins(playerId, { skin_ids: skinIds });
      toast({
        title: "Success",
        description: "Player skins updated successfully!",
      });
      return updatedPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update player skins';
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

  return {
    loading,
    error,
    addSkin,
    removeSkin,
    addSkinsBatch,
    removeSkinsBatch,
    setSkins
  };
}; 