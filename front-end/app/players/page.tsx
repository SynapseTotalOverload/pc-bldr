'use client'
import { ThemeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayersTable } from "@/components/players-table";
import { playersColumns } from "@/models/players-table/columns";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerCreate, PlayerUpdate } from "@/types/players-base";
import WarningModal from "@/models/dialogs/warning-modal";

export default function Players() {
    const router = useRouter()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);
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
    setPlayerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlayer = async () => {
    if (!playerToDelete) return;
    
    try {
      await removePlayer(playerToDelete);
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
    } catch (error) {
      console.error('Error deleting player:', error);
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
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
          <div className="flex items-center justify-between">
            <h1 className="mb-8 text-4xl font-bold">Players</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/accessories">
                  <Button>Accessories</Button>
              </Link>
              <Link href="/builds">
                  <Button>Builds</Button>
              </Link>
              <Link href="/">
                  <Button>Products</Button>
              </Link>
              <Link href="/configurator">
                  <Button>Configurator</Button>
              </Link>
              <Link href="/skins">
                  <Button>Skins</Button>
              </Link>
            </div>
          </div>
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