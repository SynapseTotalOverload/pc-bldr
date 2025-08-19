'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayersTable } from "@/components/players-table";
import { playersColumns } from "@/models/players-table/columns";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerCreate, PlayerUpdate } from "@/types/players-base";
import { useFile } from "@/hooks/useFile";
import WarningModal from "@/models/dialogs/warning-modal";
import { MainMenu } from "@/components/ui/menu";

export default function Players() {
    const router = useRouter()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);
    const [playerToDeleteUrl, setPlayerToDeleteUrl] = useState<string | null>(null);
    const [pcImageToDeleteUrl, setPcImageToDeleteUrl] = useState<string | null>(null);
    const { remove } = useFile();
    const { 
        players, 
        loading, 
        error, 
        fetchPlayers, 
        addPlayer, 
        editPlayer, 
        removePlayer, 
        pagination 
    } = usePlayers()

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
          router.push('/auth');
        } else {
          fetchPlayers({ limit: 10 })
        }
      }, [router]);

    

  const handleAddPlayer = async (data: PlayerCreate) => {
    await addPlayer(data)
  }

  const handleEditPlayer = async (id: number, data: PlayerUpdate) => {
    await editPlayer(id, data)
  }

  const handleDeletePlayer = async (id: number) => {
    const target = players.find(p => p.id === id);
    setPlayerToDelete(id);
    setPlayerToDeleteUrl(target?.player_img || null);
    setPcImageToDeleteUrl((target as any)?.pc_image || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlayer = async () => {
    if (!playerToDelete) return;
    
    try {
      setIsDeleteModalOpen(false);

      await removePlayer(playerToDelete);

      if (playerToDeleteUrl) {
        try {
          await remove({ url: playerToDeleteUrl });
        } catch (err) {
          console.error('Failed to delete player image', err);
        }
      }

      if (pcImageToDeleteUrl) {
        try {
          await remove({ url: pcImageToDeleteUrl });
        } catch (err) {
          console.error('Failed to delete pc image', err);
        }
      }

      setPlayerToDelete(null);
      setPlayerToDeleteUrl(null);
      setPcImageToDeleteUrl(null);
    } catch (error) {
      console.error('Error deleting player:', error);
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
      setPlayerToDeleteUrl(null);
      setPcImageToDeleteUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading players...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div>
      <main className="bg-background flex min-h-screen flex-col items-center justify-between p-4">
        <div className="z-10 w-full items-center justify-between font-mono text-sm">
          <MainMenu />
          <div className="mt-8 w-full">
            <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
              <PlayersTable
                data={players}
                columns={playersColumns}
                onAddPlayer={handleAddPlayer}
                onEditPlayer={handleEditPlayer}
                onDeletePlayer={handleDeletePlayer}
                pagination={{
                  total: pagination.total,
                  skip: pagination.skip,
                  limit: pagination.limit,
                  has_more: pagination.has_more
                }}
                onPageChange={(skip) => fetchPlayers({ skip, limit: pagination.limit })}
                onLimitChange={(limit) => fetchPlayers({ skip: 0, limit })}
                onSearch={(query) => fetchPlayers({ query, skip: 0, limit: pagination.limit })}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlayerToDelete(null);
          setPlayerToDeleteUrl(null);
          setPcImageToDeleteUrl(null);
        }}
        onConfirm={confirmDeletePlayer}
        title="Confirm Deletion"
        message="Are you sure you want to delete this player? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}