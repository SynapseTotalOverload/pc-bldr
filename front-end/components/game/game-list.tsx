"use client"
import { GameCard } from "@/components/game/game-card"
import { Plus, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { AddEditGame } from "@/models/dialogs/add-edit-game"
import { useGames } from "@/hooks/useGames"
import { GameBase } from "@/types/game-base"
import WarningModal from "@/models/dialogs/warning-modal"
import { useFile } from '@/hooks/useFile'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"

export const GameList = () => {
    const [searchValue, setSearchValue] = useState("")
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [gameToDelete, setGameToDelete] = useState<GameBase | null>(null)
    const [editingGame, setEditingGame] = useState<GameBase | null>(null)
    const { games, pagination, createGame, updateGame, fetchGames, deleteGame } = useGames()
    const { remove } = useFile()
    const [page, setPage] = useState(1)
    const itemsPerPage = 10

    const fetchWithParams = (p:number, query?:string)=>{
        fetchGames({skip:(p-1)*itemsPerPage, limit:itemsPerPage, query})
    }

    const handleSearch = () => {
        setPage(1)
        fetchWithParams(1, searchValue)
    }

    const onSave = async (data: FormData) => {
        if (isEditing && editingGame?.id) {
            await updateGame(editingGame.id, data)
        } else {
            await createGame(data)
        }
    }

    const onEdit = (game: GameBase) => {
        setEditingGame(game)
        setIsEditing(true)
        setAddDialogOpen(true)
    }

    const onDelete = (game: GameBase) => {
        setGameToDelete(game)
        setIsDeleteModalOpen(true)
    }

    useEffect(() => {
        fetchWithParams(page)
    }, [])

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-4 justify-between">
                <div className="flex items-center gap-2 w-full max-w-sm">
                <Input
                    placeholder="Search games..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    className="max-w-full"
                />
                <Button onClick={handleSearch} size="sm">
                    <Search className="h-4 w-4" />
                </Button>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Game
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} onEdit={() => onEdit(game)} onDelete={() => onDelete(game)}/>
                ))}
            </div>

                    {pagination && (
                <Pagination className="py-4 justify-end">
                    <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e)=>{e.preventDefault(); if(page>1){const newP=page-1;setPage(newP);fetchWithParams(newP,searchValue)}}} className={page===1?"pointer-events-none opacity-50":undefined} />
                    </PaginationItem>

                    {/* first page */}
                    <PaginationItem>
                        <PaginationLink href="#" isActive={page===1} onClick={(e)=>{e.preventDefault(); const newP=1;setPage(newP);fetchWithParams(newP,searchValue)}}>
                        1
                        </PaginationLink>
                    </PaginationItem>

                    {/* left ellipsis */}
                    {page-2>2 && (
                        <PaginationItem><PaginationEllipsis /></PaginationItem>
                    )}

                    {/* middle pages */}
                    {(() => {
                        const items=[];
                        const start=Math.max(2,page-1);
                        const end=Math.min((pagination?.totalPages||1)-1,page+1);
                        for(let i=start;i<=end;i++){
                        items.push(
                            <PaginationItem key={i}>
                            <PaginationLink href="#" isActive={page===i} onClick={(e)=>{e.preventDefault(); const newP=i;setPage(newP);fetchWithParams(newP,searchValue)}}>{i}</PaginationLink>
                            </PaginationItem>
                        )
                        }
                        return items;
                    })()}

                    {/* right ellipsis */}
                    {page+1 < (pagination?.totalPages||1)-1 && (
                        <PaginationItem><PaginationEllipsis /></PaginationItem>
                    )}

                    {/* last page */}
                    {pagination && pagination.totalPages>1 && (
                        <PaginationItem>
                        <PaginationLink href="#" isActive={page===pagination.totalPages} onClick={(e)=>{e.preventDefault(); const newP=pagination.totalPages;setPage(newP);fetchWithParams(newP,searchValue)}}>
                            {pagination.totalPages}
                        </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext href="#" onClick={(e)=>{e.preventDefault(); if(page<pagination.totalPages){const newP=page+1;setPage(newP);fetchWithParams(newP,searchValue)}}} className={page===pagination?.totalPages?"pointer-events-none opacity-50":undefined} />
                    </PaginationItem>
                    </PaginationContent>
                </Pagination>
                    )}

            <AddEditGame
                open={addDialogOpen}
                onOpenChange={(open)=>{if(!open){setIsEditing(false);setEditingGame(null);} setAddDialogOpen(open)}}
                isEditing={isEditing}
                onSave={onSave}
                game={editingGame ?? undefined}
            />
            <WarningModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                setIsDeleteModalOpen(false);
                setGameToDelete(null);
                }}
                onConfirm={() => {
                    (async ()=>{
                      if (gameToDelete){
                         try{ if(gameToDelete.image) await remove({url:gameToDelete.image}) } catch{}
                         try{ if((gameToDelete as any).icon) await remove({url:(gameToDelete as any).icon}) } catch{}
                         await deleteGame(gameToDelete.id as number)
                      }
                    })()
                    setIsDeleteModalOpen(false)
                    setGameToDelete(null)
                }}
                title="Confirm Deletion"
                message="Are you sure you want to delete this game? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    )
}