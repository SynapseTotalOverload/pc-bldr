"use client"
import { Button } from "@/components/ui/button"
import { useStickers } from "@/hooks/useStickers"
import { useFile } from "@/hooks/useFile"
import { useEffect, useState } from "react"
import { SkinsTable } from "@/components/skins-table"
import WarningModal from "@/models/dialogs/warning-modal"
import { StickersBase } from "@/types/stickers-base"
import { AddEditStickers } from "@/models/dialogs/add-edit-stickers"
import { ColumnDef } from "@tanstack/react-table"
import { useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function StickersPage() {

    const { stickers, loading, error, fetchStickers, createSticker, updateSticker, deleteSticker, pagination } = useStickers()

    const { remove } = useFile()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [stickerToDelete, setStickerToDelete] = useState<StickersBase | null>(null)
    const [stickerToEdit, setStickerToEdit] = useState<StickersBase | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const handleSearchChange = (value: string) => {
        setSearch(value)
        fetchStickers({ query: value, skip: 0, limit } as any)
        setPage(1)
    }

    const goToPage = (newPage: number) => {
        setPage(newPage)
        const skip = (newPage - 1) * limit
        fetchStickers({ query: search, skip, limit } as any)
    }
    const [limit] = useState(20)
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)

    const StickerImage = ({ url, alt }: { url: string; alt: string }) => {
        const { imageUrl, fetch, loading } = useFile()
        const wrapperRef = useRef<HTMLDivElement | null>(null)
        const [shouldLoad, setShouldLoad] = useState(false)

        useEffect(() => {
            if (!url) return
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true)
                        observer.disconnect()
                    }
                })
            }, { rootMargin: "150px" })
            if (wrapperRef.current) observer.observe(wrapperRef.current)
            return () => observer.disconnect()
        }, [url])

        useEffect(() => {
            if (shouldLoad && url) fetch({ url })
        }, [shouldLoad, url])

        if (!url) return null

        return (
            <div ref={wrapperRef} className="w-20 h-20 rounded-lg overflow-hidden border flex items-center justify-center">
                {(loading || !imageUrl) && <Skeleton className="w-full h-full" />}
                {!loading && imageUrl && (
                    <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
                )}
            </div>
        )
    }

    const stickerColumns: ColumnDef<StickersBase, any>[] = [
        {
            id: "image_file",
            header: "Image",
            cell: ({ row }) => <StickerImage url={row.original.image_url || ""} alt={row.original.name} />,
        },
        {
            id: "name",
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => {
                const s = row.original
                return (
                    <div className="space-y-0.5">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {s.class_name && `${s.class_name} · `}
                            {s.tournire && `${s.tournire} · `}
                            {s.s_type}
                        </p>
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setStickerToEdit(row.original)
                            setIsAddEditModalOpen(true)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            setStickerToDelete(row.original)
                            setIsDeleteModalOpen(true)
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    const handleAddEditSticker = async (fd: FormData) => {
        const obj: Record<string, any> = {}
        fd.forEach((value, key) => {
            obj[key] = value
        })

        try {
            if (obj.id) {
                const idNum = Number(obj.id)
                delete obj.id
                await updateSticker(idNum, obj as StickersBase)
                const skip = (page - 1) * limit
                await fetchStickers({ query: search, skip, limit } as any)
            } else {
                await createSticker(obj as StickersBase)
                await fetchStickers({ query: search, skip: 0, limit } as any)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleConfirmDeleteSticker = async () => {
        if (!stickerToDelete) return
        try {
            // First remove image from storage if exists
            if (stickerToDelete.image_url) {
                await remove({ url: stickerToDelete.image_url })
            }
            // Then delete sticker record
            if (stickerToDelete.id) {
                await deleteSticker(stickerToDelete.id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsDeleteModalOpen(false)
            setStickerToDelete(null)
        }
    }

    useEffect(() => {
        const skipInitial = 0
        fetchStickers({ skip: skipInitial, limit } as any)
    }, [])

  return (
    <>
        <div className="mt-8 w-full">
            <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
              <SkinsTable
                  columns={stickerColumns}
                  data={stickers}
                  searchKey="name"
                  searchPlaceholder="Search stickers..."
                  searchValue={""}
                  loading={loading}
                  onSearchChange={handleSearchChange}
                  pagination={{
                    currentPage: pagination?.currentPage ?? page,
                    totalPages: pagination?.totalPages ?? Math.max(1, Math.ceil((pagination?.totalItems ?? stickers.length) / limit)),
                    total: pagination?.totalItems ?? stickers.length,
                    itemsPerPage: limit
                  }}
                  onPageChange={goToPage}
                  imageColumnId="image_file"
                  primaryInfoColumnIds={["name"]}
                  secondaryInfoColumnIds={["class_name", "tournire", "s_type"]}
                  actionsColumnId="actions"
                  renderActions={() => (
                    <Button onClick={()=>{setIsAddEditModalOpen(true)}}>
                      Add new sticker
                    </Button>
                  )}
                />
            </div>
        </div>

        <AddEditStickers
            open={isAddEditModalOpen}
            onOpenChange={(v)=>{
              setIsAddEditModalOpen(v);
              if(!v) setStickerToEdit(null);
            }}
            isEditing={!!stickerToEdit}
            game={stickerToEdit || undefined}
            onSave={async (fd)=>{
              await handleAddEditSticker(fd);
              setStickerToEdit(null);
            }}
        />

        <WarningModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
            setIsDeleteModalOpen(false);
            setStickerToDelete(null);
            }}
            onConfirm={handleConfirmDeleteSticker}
            title="Confirm Deletion"
            message="Are you sure you want to delete this sticker? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
        />
    </>
  )
}