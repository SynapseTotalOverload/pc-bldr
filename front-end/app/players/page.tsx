'use client'
import { ThemeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { PlayersTable } from "@/components/players-table";
import { playersColumns } from "@/models/players-table/columns";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerCreate, PlayerUpdate } from "@/types/players-base";

export default function Players() {
    const router = useRouter()
    const { 
        players, 
        loading, 
        error, 
        fetchPlayers, 
        addPlayer, 
        editPlayer, 
        removePlayer 
    } = usePlayers()

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
          router.push('/auth');
        } else {
          fetchPlayers()
        }
      }, [router]);

    

  const handleAddPlayer = async (data: PlayerCreate) => {
    await addPlayer(data)
  }

  const handleEditPlayer = async (id: number, data: PlayerUpdate) => {
    await editPlayer(id, data)
  }

  const handleDeletePlayer = async (id: number) => {
    await removePlayer(id)
  }

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
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}