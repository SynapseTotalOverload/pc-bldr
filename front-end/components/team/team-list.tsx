"use client"
import { Plus, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "../ui/pagination"
import { TeamCard } from "./team-card"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { useTeam } from "@/hooks/useTeam"
import { AddEditTeam } from "@/models/dialogs/add-edit-team"
import { TeamRead } from "@/types/team"
import WarningModal from "@/models/dialogs/warning-modal"
import { ftruncate } from "fs"
import { useRouter } from "next/navigation"
import { useFile } from "@/hooks/useFile"

export const TeamList = () => {
    const router = useRouter()
    const { teams, pagination, loading, error, fetchTeams, createTeam, updateTeam, deleteTeam } = useTeam()
    const { remove } = useFile()
    const [searchValue, setSearchValue] = useState("")
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<TeamRead | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [teamToDelete, setTeamToDelete] = useState<TeamRead | null>(null)

    const handleSubmit = (data: any) => {
        if (selectedTeam) {
            updateTeam(selectedTeam.id, data)
        } else {
            createTeam(data)
        }
    }
    const handleSearch = () => {
        fetchTeams({ skip: 0, limit: 10, query: searchValue })
    }

    const handleEdit = (team: TeamRead) => {
        setSelectedTeam(team)
        setAddDialogOpen(true)
    }

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) setSelectedTeam(null)
        setAddDialogOpen(open)
    }

    const handleDelete = (team: TeamRead) => {
        setTeamToDelete(team)
        setIsDeleteModalOpen(true)
    }

    useEffect(() => {
        fetchTeams({ skip: (page - 1) * limit, limit })
    }, [page, limit, fetchTeams])

    const onPageChange = (newPage: number) => {
        if (!pagination) return
        const clamped = Math.max(1, Math.min(newPage, pagination.totalPages))
        setPage(clamped)
    }
    
  return (
    <div className="w-full">
        <div className="flex items-center py-4 gap-4 justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
            <Input
                placeholder="Search teams..."
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
                Add Team
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
                <TeamCard key={team.id} team={team} onView={() => router.push(`/team/${team.id}`)} onEdit={() => handleEdit(team)} onDelete={() => handleDelete(team)} />
            ))}
        </div>

        {pagination && (
          <Pagination className="py-4 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e)=>{e.preventDefault(); onPageChange(page-1)}} className={page===1?"pointer-events-none opacity-50":undefined} />
              </PaginationItem>

              {/* first page */}
              <PaginationItem>
                <PaginationLink href="#" isActive={page===1} onClick={(e)=>{e.preventDefault(); onPageChange(1)}}>
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
                const end=Math.min(pagination.totalPages-1,page+1);
                for(let i=start;i<=end;i++){
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink href="#" isActive={page===i} onClick={(e)=>{e.preventDefault(); onPageChange(i)}}>{i}</PaginationLink>
                    </PaginationItem>
                  )
                }
                return items;
              })()}

              {/* right ellipsis */}
              {page+1 < pagination.totalPages-1 && (
                <PaginationItem><PaginationEllipsis /></PaginationItem>
              )}

              {/* last page */}
              {pagination.totalPages>1 && (
                <PaginationItem>
                  <PaginationLink href="#" isActive={page===pagination.totalPages} onClick={(e)=>{e.preventDefault(); onPageChange(pagination.totalPages)}}>
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext href="#" onClick={(e)=>{e.preventDefault(); onPageChange(page+1)}} className={page===pagination.totalPages?"pointer-events-none opacity-50":undefined} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <AddEditTeam
            open={addDialogOpen}
            onOpenChange={handleDialogOpenChange}
            onSave={handleSubmit}
            team={selectedTeam as any}
            teamId={selectedTeam?.id as number}
        />

        <WarningModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
            setIsDeleteModalOpen(false);
            setTeamToDelete(null);
            }}
            onConfirm={() => {
                (async () => {
                  if (teamToDelete) {
                    try {
                      if (teamToDelete.logo) await remove({ url: teamToDelete.logo })
                    } catch {}
                    try {
                      if (teamToDelete.jerseys_img) await remove({ url: teamToDelete.jerseys_img })
                    } catch {}

                    await deleteTeam(teamToDelete.id)
                  }
                })()
                setIsDeleteModalOpen(false)
                setTeamToDelete(null)
            }}
            title="Confirm Deletion"
            message="Are you sure you want to delete this team? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
        />
    </div>
  )
}