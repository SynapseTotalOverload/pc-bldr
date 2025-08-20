import { useState, useCallback } from "react"
import { stickersApi } from "@/lib/stickers-api"
import { StickersBase, GetStickersParams } from "@/types/stickers-base"

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  has_more?: boolean
}

interface StickersResponse {
  items: StickersBase[]
  pagination: Pagination
  has_more?: boolean
}

export const useStickers = () => {
  const [stickers, setStickers] = useState<StickersBase[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStickers = useCallback(async (params?: GetStickersParams) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching stickers with params:", params)
      const response = await stickersApi.getStickers(params)
      console.log("Stickers API response:", response)
      if (Array.isArray(response)) {
        console.log("Setting stickers array:", response)
        setStickers(response as StickersBase[])
        setPagination(null)
      } else {
        if ((response as any).items && (response as any).pagination) {
          const resp = response as StickersResponse
          console.log("Setting stickers with pagination:", resp)
          setStickers(resp.items)
          setPagination(resp.pagination)
        } else if ((response as any).items && (response as any).total !== undefined) {
          const r = response as { items: StickersBase[]; total: number; skip: number; limit: number }
          console.log("Setting stickers with total:", r)
          setStickers(r.items)
          setPagination({
            currentPage: Math.floor(r.skip / r.limit) + 1,
            totalPages: Math.ceil(r.total / r.limit),
            totalItems: r.total,
            itemsPerPage: r.limit,
            has_more: r.skip + r.limit < r.total,
          })
        } else if ((response as any).items && (response as any).has_more !== undefined) {
          const r = response as { items: StickersBase[]; total: number; skip: number; limit: number; has_more: boolean }
          console.log("Setting stickers with has_more structure:", r)
          setStickers(r.items)
          setPagination({
            currentPage: Math.floor(r.skip / r.limit) + 1,
            totalPages: Math.ceil((r.skip + r.limit) / r.limit),
            totalItems: r.items.length + (r.has_more ? r.limit : 0),
            itemsPerPage: r.limit,
            has_more: r.has_more,
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stickers')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStickersByTeamId = useCallback(async (teamId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = (await stickersApi.getStickersByTeamId(teamId)) as StickersBase[]
      setStickers(response)
      setPagination(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const createSticker = useCallback(async (payload: StickersBase) => {
    setLoading(true)
    setError(null)
    try {
      await stickersApi.postStickers(payload)
      await fetchStickers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [fetchStickers])

  const updateSticker = useCallback(async (id: number, payload: StickersBase) => {
    setLoading(true)
    setError(null)
    try {
      await stickersApi.putStickers(id, payload)
      await fetchStickers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [fetchStickers])

  const deleteSticker = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await stickersApi.deleteStickers(id)
      setStickers(prev => prev.filter(sticker => sticker.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    stickers,
    pagination,
    loading,
    error,
    fetchStickers,
    fetchStickersByTeamId,
    createSticker,
    updateSticker,
    deleteSticker,
  }
}