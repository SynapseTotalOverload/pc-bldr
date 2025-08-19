import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomProductReletion, CustomProductReletionSimple, PlayerCreate, PlayerUpdate, PlayerWithRelations } from "@/types/players-base"
import { SelectListProductNew } from '@/components/ui/select-list-product-new'
import { SkinReadWithAttributes } from "@/lib/skins-api"
import { SelectSkinList } from "@/components/ui/select-skin-list"
import { SelectCustProducts } from "@/components/ui/select-cust-products"
import { useFile } from "@/hooks/useFile"
import { useCountries } from "@/hooks/useCountries"
import { Country } from "@/types/country"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { useTeam } from "@/hooks/useTeam"
import { useGames } from "@/hooks/useGames"
import { GameBase } from "@/types/game-base"
import { TeamRead } from "@/types/team"

interface AddEditPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  player?: PlayerWithRelations | null
  onSave: (data: PlayerCreate | PlayerUpdate, mode: 'add' | 'edit') => Promise<void>
  mode: 'add' | 'edit'
}

export function AddEditPlayerDialog({
  open,
  onOpenChange,
  player,
  onSave,
  mode
}: AddEditPlayerDialogProps) {
  const [formData, setFormData] = useState<PlayerCreate>({
    player_name: "",
    player_img: "",
    team: "",
    country_id: undefined,
    name: "",
    birthday: undefined,
    info: "",
    note: "",
    pc_image: "",
    pc_image_name: ""
  })
  const [selectedCpuId, setSelectedCpuId] = useState<string>("none")
  const [selectedCpuDate, setSelectedCpuDate] = useState<string>("")
  const [selectedCpuCoolerId, setSelectedCpuCoolerId] = useState<string>("none")
  const [selectedCpuCoolerDate, setSelectedCpuCoolerDate] = useState<string>("")
  const [selectedGpuId, setSelectedGpuId] = useState<string>("none")
  const [selectedGpuDate, setSelectedGpuDate] = useState<string>("")
  const [selectedMotherboardId, setSelectedMotherboardId] = useState<string>("none")
  const [selectedMotherboardDate, setSelectedMotherboardDate] = useState<string>("")
  const [selectedRamId, setSelectedRamId] = useState<string>("none")
  const [selectedRamDate, setSelectedRamDate] = useState<string>("")
  const [selectedStorageId, setSelectedStorageId] = useState<string>("none")
  const [selectedStorageDate, setSelectedStorageDate] = useState<string>("")
  const [selectedPowerSupplyId, setSelectedPowerSupplyId] = useState<string>("none")
  const [selectedPowerSupplyDate, setSelectedPowerSupplyDate] = useState<string>("")
  const [selectedCaseId, setSelectedCaseId] = useState<string>("none")
  const [selectedCaseDate, setSelectedCaseDate] = useState<string>("")
  const [pcSpecsListId, setPcSpecsListId] = useState<number | null>(null)
  const [selectedSkins, setSelectedSkins] = useState<SkinReadWithAttributes[]>([])

  const [selectedCustProducts, setSelectedCustProducts] = useState<CustomProductReletionSimple[]>([])
  const [finaliCustProducts, setFinaliCustProducts] = useState<CustomProductReletion>()

  const [selectedHeadsetId, setSelectedHeadsetId] = useState<string>("none")
  const [selectedHeadsetDate, setSelectedHeadsetDate] = useState<string>("")
  const [selectedKeyboardId, setSelectedKeyboardId] = useState<string>("none")
  const [selectedKeyboardDate, setSelectedKeyboardDate] = useState<string>("")
  const [selectedMouseId, setSelectedMouseId] = useState<string>("none")
  const [selectedMouseDate, setSelectedMouseDate] = useState<string>("")
  const [selectedMousepadId, setSelectedMousepadId] = useState<string>("none")
  const [selectedMousepadDate, setSelectedMousepadDate] = useState<string>("")
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>("none")
  const [selectedMonitorDate, setSelectedMonitorDate] = useState<string>("")
  const [selectedEarphonesId, setSelectedEarphonesId] = useState<string>("none")
  const [selectedEarphonesDate, setSelectedEarphonesDate] = useState<string>("")

  const [selectedChairId, setSelectedChairId] = useState<string>("none")
  const [selectedChairDate, setSelectedChairDate] = useState<string>("")
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>("none")
  const [selectedMicrophoneDate, setSelectedMicrophoneDate] = useState<string>("")
  const [selectedCameraId, setSelectedCameraId] = useState<string>("none")
  const [selectedCameraDate, setSelectedCameraDate] = useState<string>("")

  const [gearListId, setGearListId] = useState<number | null>(null)
  const [setupStreamingListId, setSetupStreamingListId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [checkPlayerImg, setCheckPlayerImg] = useState(false)
  // Player avatar
  const [playerFileImg, setPlayerFileImg] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)

  const { countries, loading: countriesLoading, error: countriesError, loadMore, pagination, fetchCountries } = useCountries({
    skip: 0,
    limit: 25,
    query: "",
  }, { autoFetch: false })

  const handleCountrySelectOpenChange = (open: boolean) => {
    setCountrySelectOpen(open)
    if (open && countries.length === 0) {
      fetchCountries()
    }
  }

  useEffect(() => {
    if (!countrySelectOpen) return
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    }, {
      root: loadMoreRef.current.parentElement?.parentElement ?? null,
      threshold: 1.0,
    })
    observer.observe(loadMoreRef.current)
    return () => {
      observer.disconnect()
    }
  }, [countrySelectOpen, loadMore, pagination])

  useEffect(() => {
    if (selectedCountryId && !selectedCountryObj) {
      const obj = countries.find(c => c.id === selectedCountryId) || null
      if (obj) setSelectedCountryObj(obj)
    }
  }, [countries, selectedCountryId, selectedCountryObj])

  const [pcFileImg, setPcFileImg] = useState<File | null>(null)
  const [pcPreviewUrl, setPcPreviewUrl] = useState<string | null>(null)

  const { upload, remove } = useFile()

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const pcInputRef = useRef<HTMLInputElement>(null)

  const handleUploadAvatarClick = () => {
    avatarInputRef.current?.click()
  }

  const handleUploadPcClick = () => {
    pcInputRef.current?.click()
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPlayerFileImg(file || null)
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  const handlePcFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPcFileImg(file || null)
    if (file) setPcPreviewUrl(URL.createObjectURL(file))
  }

  const uploadFileAndGetUrl = async (file: File): Promise<string | undefined> => {
    try {
      const record = await upload(file)
      return record.url
    } catch (err) {
      console.error('Image upload failed', err)
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (pcPreviewUrl) URL.revokeObjectURL(pcPreviewUrl)
    }
  }, [previewUrl, pcPreviewUrl])
  
  const urlFormSchema = z.object({
    url_youtube: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_twitch: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_tiktok: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_instagram: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_discord: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_steam: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  })
  type UrlFormData = z.infer<typeof urlFormSchema>

  const urlForm = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url_youtube: '',
      url_twitter: '',
      url_twitch: '',
      url_tiktok: '',
      url_instagram: '',
      url_discord: '',
      url_steam: '',
    },
  })


  useEffect(() => {
    if (open && player && mode === 'edit') {
      setFormData({
        player_name: player.player_name || "",
        player_img: player.player_img || "",
        team: (typeof player.team === "string" ? player.team : (player.team as any)?.name) || "",
        country_id: player.country_id || undefined,
        name: player.name || "",
        birthday: player.birthday || undefined,
        info: player.info || "",
        note: player.note || "",
        pc_image_name: player.pc_image_name || "",
        pc_image: player.pc_image || "",
        user_urls: player.user_urls || {
          youtube: "",
          twitter: "",
          twitch: "",
          tiktok: "",
          instagram: "",
          discord: "",
          steam: ""
        }
      })
      setPcPreviewUrl(player.pc_image || null)
      console.log("player", player)
      urlForm.reset({
        url_youtube: player.user_urls?.youtube || '',
        url_twitter: player.user_urls?.twitter || '',
        url_twitch: player.user_urls?.twitch || '',
        url_tiktok: player.user_urls?.tiktok || '',
        url_instagram: player.user_urls?.instagram || '',
        url_discord: player.user_urls?.discord || '',
        url_steam: player.user_urls?.steam || '',
      })
      
      if (player.pc_specs_list) {
        setPcSpecsListId(player.pc_specs_list.id)
        
        if (player.pc_specs_list.cpu?.id) {
          setSelectedCpuId(player.pc_specs_list.cpu.id.toString())
          setSelectedCpuDate(player.pc_specs_list.cpu.usage_start_datetime || "")
        } else {
          setSelectedCpuId("none")
          setSelectedCpuDate("")
        }
        if (player.pc_specs_list.cpu_cooler?.id) {
          setSelectedCpuCoolerId(player.pc_specs_list.cpu_cooler.id.toString())
          setSelectedCpuCoolerDate(player.pc_specs_list.cpu_cooler.usage_start_datetime || "")
        } else {
          setSelectedCpuCoolerId("none")
          setSelectedCpuCoolerDate("")
        }
        
        if (player.pc_specs_list.gpu?.id) {
          setSelectedGpuId(player.pc_specs_list.gpu.id.toString())
          setSelectedGpuDate(player.pc_specs_list.gpu.usage_start_datetime || "")
        }
        
        if (player.pc_specs_list.motherboard?.id) {
          setSelectedMotherboardId(player.pc_specs_list.motherboard.id.toString())
          setSelectedMotherboardDate(player.pc_specs_list.motherboard.usage_start_datetime || "")
        }
        
        if (player.pc_specs_list.ram?.id) {
          setSelectedRamId(player.pc_specs_list.ram.id.toString())
          setSelectedRamDate(player.pc_specs_list.ram.usage_start_datetime || "")
        }
        
        if (player.pc_specs_list.storage?.id) {
          setSelectedStorageId(player.pc_specs_list.storage.id.toString())
          setSelectedStorageDate(player.pc_specs_list.storage.usage_start_datetime || "")
        }
        
        if (player.pc_specs_list.power_supply?.id) {
          setSelectedPowerSupplyId(player.pc_specs_list.power_supply.id.toString())
          setSelectedPowerSupplyDate(player.pc_specs_list.power_supply.usage_start_datetime || "")
        }
        
        if (player.pc_specs_list.case?.id) {
          setSelectedCaseId(player.pc_specs_list.case.id.toString())
          setSelectedCaseDate(player.pc_specs_list.case.usage_start_datetime || "")
        }
      
      } else {
        setPcSpecsListId(null)
        setSelectedCpuId("none")
        setSelectedCpuDate("")
        setSelectedCpuCoolerId("none")
        setSelectedCpuCoolerDate("")
        setSelectedGpuId("none")
        setSelectedGpuDate("")
        setSelectedMotherboardId("none")
        setSelectedMotherboardDate("")
        setSelectedRamId("none")
        setSelectedRamDate("")
        setSelectedStorageId("none")
        setSelectedStorageDate("")
        setSelectedPowerSupplyId("none")
        setSelectedPowerSupplyDate("")
        setSelectedCaseId("none")
        setSelectedCaseDate("")
      }
      if (player.gear_list) {
        setGearListId(player.gear_list.id)
        
       if (player.gear_list.headset?.id) {
          setSelectedHeadsetId(player.gear_list.headset.id.toString())
          setSelectedHeadsetDate(player.gear_list.headset.usage_start_datetime || "")
        } else {
          setSelectedHeadsetId("none")
          setSelectedHeadsetDate("")
        }
        
        if (player.gear_list.keyboard?.id) {
          setSelectedKeyboardId(player.gear_list.keyboard.id.toString())
          setSelectedKeyboardDate(player.gear_list.keyboard.usage_start_datetime || "")
        } else {
          setSelectedKeyboardId("none")
          setSelectedKeyboardDate("")
        }
        
        if (player.gear_list.mouse?.id) {
          setSelectedMouseId(player.gear_list.mouse.id.toString())
          setSelectedMouseDate(player.gear_list.mouse.usage_start_datetime || "")
        } else {
          setSelectedMouseId("none")
          setSelectedMouseDate("")
        }
        
        if (player.gear_list.mousepad?.id) {
          setSelectedMousepadId(player.gear_list.mousepad.id.toString())
          setSelectedMousepadDate(player.gear_list.mousepad.usage_start_datetime || "")
        } else {
          setSelectedMousepadId("none")
          setSelectedMousepadDate("")
        }
        
        if (player.gear_list.monitor?.id) {
          setSelectedMonitorId(player.gear_list.monitor.id.toString())
          setSelectedMonitorDate(player.gear_list.monitor.usage_start_datetime || "")
        } else {
          setSelectedMonitorId("none")
          setSelectedMonitorDate("")
        }

        if (player.gear_list.earphones?.id) {
          setSelectedEarphonesId(player.gear_list.earphones.id.toString())
          setSelectedEarphonesDate(player.gear_list.earphones.usage_start_datetime || "")
        } else {
          setSelectedEarphonesId("none")
          setSelectedEarphonesDate("")
        }

      } else {
        setGearListId(null)
        setSelectedHeadsetId("none")
        setSelectedHeadsetDate("")
        setSelectedKeyboardId("none")
        setSelectedKeyboardDate("")
        setSelectedMouseId("none")
        setSelectedMouseDate("")
        setSelectedMousepadId("none")
        setSelectedMousepadDate("")
        setSelectedMonitorId("none")
        setSelectedMonitorDate("")
        setSelectedEarphonesId("none")
        setSelectedEarphonesDate("")
      }

      if (player.setup_streaming_list) {
        setSetupStreamingListId(player.setup_streaming_list.id)
        if (player.setup_streaming_list.chair?.id) {
          setSelectedChairId(player.setup_streaming_list.chair.id.toString())
          setSelectedChairDate(player.setup_streaming_list.chair.usage_start_datetime || "")
        } else {
          setSelectedChairId("none")
          setSelectedChairDate("")
        }
       if (player.setup_streaming_list.microphone?.id) {
          setSelectedMicrophoneId(player.setup_streaming_list.microphone.id.toString())
          setSelectedMicrophoneDate(player.setup_streaming_list.microphone.usage_start_datetime || "")
        } else {
          setSelectedMicrophoneId("none")
          setSelectedMicrophoneDate("")
        }
        if (player.setup_streaming_list.camera?.id) {
          setSelectedCameraId(player.setup_streaming_list.camera.id.toString())
          setSelectedCameraDate(player.setup_streaming_list.camera.usage_start_datetime || "")
        } else {
          setSelectedCameraId("none")
          setSelectedCameraDate("")
        }
      } else {
        setSetupStreamingListId(null)
        setSelectedChairId("none")
        setSelectedChairDate("")
        setSelectedMicrophoneId("none")
        setSelectedMicrophoneDate("")
        setSelectedCameraId("none")
        setSelectedCameraDate("")
      }
      setSelectedCustProducts(player?.custom_product_reletion || [])
      setSelectedCountryId(player?.country_id || null)
      setSelectedCountryObj(player?.country || null)
      setSelectedTeamId((player.team as any)?.id ?? null)
      setSelectedTeamObj(typeof player.team === "object" ? (player.team as any) : null)

      if ((player as any)?.game_id) {
        setSelectedGameId((player as any).game_id)
      }

      if ((player as any)?.game) {
        setSelectedGameObj((player as any).game)
      }

    } else if (open && mode === 'add') {
      setFormData({
        player_name: "",
        player_img: "",
        team: "",
        country_id: undefined,
        name: "",
        birthday: undefined,
        info: "",
        note: "",
        pc_image_name: "",
        pc_image: ""
      })
      setPcSpecsListId(null)
      setSelectedCpuId("none")
      setSelectedCpuDate("")
      setSelectedCpuCoolerId("none")
      setSelectedCpuCoolerDate("")
      setSelectedGpuId("none")
      setSelectedGpuDate("")
      setSelectedMotherboardId("none")
      setSelectedMotherboardDate("")
      setSelectedRamId("none")
      setSelectedRamDate("")
      setSelectedStorageId("none")
      setSelectedStorageDate("")
      setSelectedPowerSupplyId("none")
      setSelectedPowerSupplyDate("")
      setSelectedCaseId("none")
      setSelectedCaseDate("")
      urlForm.reset({
        url_youtube: '',
        url_twitter: '',
        url_twitch: '',
        url_tiktok: '',
        url_instagram: '',
        url_discord: '',
        url_steam: '',
      })

      setGearListId(null)
      setSelectedHeadsetId("none")
      setSelectedHeadsetDate("")
      setSelectedKeyboardId("none")
      setSelectedKeyboardDate("")
      setSelectedMouseId("none")
      setSelectedMouseDate("")
      setSelectedMousepadId("none")
      setSelectedMousepadDate("")
      setSelectedMonitorId("none")
      setSelectedMonitorDate("")
      setSelectedEarphonesId("none")
      setSelectedEarphonesDate("")


      setSetupStreamingListId(null)
      setSelectedChairId("none")
      setSelectedChairDate("")
      setSelectedMicrophoneId("none")
      setSelectedMicrophoneDate("")
      setSelectedCameraId("none")
      setSelectedCameraDate("")

      setSelectedCustProducts([])
      setSelectedCountryId(null)
      setSelectedCountryObj(null)
      setSelectedGameId(null)
      setSelectedGameObj(null)
    }
  }, [player, mode, open])

  const { teams, loading: teamsLoading, pagination: teamsPagination, fetchTeams } = useTeam()
  const { games: gamesList, pagination: gamesPagination, fetchGames } = useGames()

  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [selectedGameObj, setSelectedGameObj] = useState<GameBase | null>(null)
  const [gameSelectOpen, setGameSelectOpen] = useState(false)

  const handleGameSelectOpenChange = (open: boolean) => {
    setGameSelectOpen(open)
    if (open && gamesList.length === 0) {
      fetchGames({ skip: 0, limit: 25 })
    }
  }

  useEffect(() => {
    if (selectedGameId && !selectedGameObj) {
      const obj = gamesList.find(g => g.id === selectedGameId) || null
      if (obj) setSelectedGameObj(obj)
    }
  }, [gamesList, selectedGameId, selectedGameObj])

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [selectedTeamObj, setSelectedTeamObj] = useState<TeamRead | null>(null)
  const [teamSelectOpen, setTeamSelectOpen] = useState(false)

  const handleTeamSelectOpenChange = (open: boolean) => {
    setTeamSelectOpen(open)
    if (open && teams.length === 0) {
      fetchTeams({ skip: 0, limit: 25 })
    }
  }

  useEffect(() => {
    if (selectedTeamId && !selectedTeamObj) {
      const obj = teams.find(t => t.id === selectedTeamId) || null
      if (obj) setSelectedTeamObj(obj)
    }
  }, [teams, selectedTeamId, selectedTeamObj])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'add' && (!formData.player_name || formData.player_name.trim().length === 0)) {
        throw new Error('Player Name is required')
      }

      const pcSpecsListData = {
        id: pcSpecsListId || undefined,
        cpu: {
          id: selectedCpuId !== 'none' ? parseInt(selectedCpuId) : undefined,
          usage_start_datetime: selectedCpuDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu?.id)?.usage_start_datetime || undefined,
          old_id: (selectedCpuId !== player?.pc_specs_list?.cpu?.id?.toString() || selectedCpuDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.cpu?.id || (selectedCpuId !== 'none' ? parseInt(selectedCpuId) : undefined)) : undefined,
          data_change: (selectedCpuDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu?.id)?.usage_start_datetime && selectedCpuDate !== undefined && selectedCpuDate !== "" && selectedCpuId === player?.pc_specs_list?.cpu?.id?.toString()) ? true : false,
          id_change: (selectedCpuId !== player?.pc_specs_list?.cpu?.id?.toString()) ? true : false
        },
        cpu_cooler: {
          id: selectedCpuCoolerId !== 'none' ? parseInt(selectedCpuCoolerId) : undefined,
          usage_start_datetime: selectedCpuCoolerDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu_cooler?.id)?.usage_start_datetime || undefined,
          old_id: (selectedCpuCoolerId !== player?.pc_specs_list?.cpu_cooler?.id?.toString() || selectedCpuCoolerDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu_cooler?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.cpu_cooler?.id || (selectedCpuCoolerId !== 'none' ? parseInt(selectedCpuCoolerId) : undefined)) : undefined,
          data_change: (selectedCpuCoolerDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.cpu_cooler?.id)?.usage_start_datetime && selectedCpuCoolerDate !== undefined && selectedCpuCoolerDate !== "" && selectedCpuCoolerId === player?.pc_specs_list?.cpu_cooler?.id?.toString()) ? true : false,
          id_change: (selectedCpuCoolerId !== player?.pc_specs_list?.cpu_cooler?.id?.toString()) ? true : false
        },
        gpu: {
          id: selectedGpuId !== 'none' ? parseInt(selectedGpuId) : undefined,
          usage_start_datetime: selectedGpuDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.gpu?.id)?.usage_start_datetime || undefined,
          old_id: (selectedGpuId !== player?.pc_specs_list?.gpu?.id?.toString() || selectedGpuDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.gpu?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.gpu?.id || (selectedGpuId !== 'none' ? parseInt(selectedGpuId) : undefined)) : undefined,
          data_change: (selectedGpuDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.gpu?.id)?.usage_start_datetime && selectedGpuDate !== undefined && selectedGpuDate !== "" && selectedGpuId === player?.pc_specs_list?.gpu?.id?.toString()) ? true : false,
          id_change: (selectedGpuId !== player?.pc_specs_list?.gpu?.id?.toString()) ? true : false
        },
        motherboard: {
          id: selectedMotherboardId !== 'none' ? parseInt(selectedMotherboardId) : undefined,
          usage_start_datetime: selectedMotherboardDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.motherboard?.id)?.usage_start_datetime || undefined,
          old_id: (selectedMotherboardId !== player?.pc_specs_list?.motherboard?.id?.toString() || selectedMotherboardDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.motherboard?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.motherboard?.id || (selectedMotherboardId !== 'none' ? parseInt(selectedMotherboardId) : undefined)) : undefined,
          data_change: (selectedMotherboardDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.motherboard?.id)?.usage_start_datetime && selectedMotherboardDate !== undefined && selectedMotherboardDate !== "" && selectedMotherboardId === player?.pc_specs_list?.motherboard?.id?.toString()) ? true : false,
          id_change: (selectedMotherboardId !== player?.pc_specs_list?.motherboard?.id?.toString()) ? true : false
        },
        ram: {
          id: selectedRamId !== 'none' ? parseInt(selectedRamId) : undefined,
          usage_start_datetime: selectedRamDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.ram?.id)?.usage_start_datetime || undefined,
          old_id: (selectedRamId !== player?.pc_specs_list?.ram?.id?.toString() || selectedRamDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.ram?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.ram?.id || (selectedRamId !== 'none' ? parseInt(selectedRamId) : undefined)) : undefined,
          data_change: (selectedRamDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.ram?.id)?.usage_start_datetime && selectedRamDate !== undefined && selectedRamDate !== "" && selectedRamId === player?.pc_specs_list?.ram?.id?.toString()) ? true : false,
          id_change: (selectedRamId !== player?.pc_specs_list?.ram?.id?.toString()) ? true : false
        },
        storage: {
          id: selectedStorageId !== 'none' ? parseInt(selectedStorageId) : undefined,
          usage_start_datetime: selectedStorageDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.storage?.id)?.usage_start_datetime || undefined,
          old_id: (selectedStorageId !== player?.pc_specs_list?.storage?.id?.toString() || selectedStorageDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.storage?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.storage?.id || (selectedStorageId !== 'none' ? parseInt(selectedStorageId) : undefined)) : undefined,
          data_change: (selectedStorageDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.storage?.id)?.usage_start_datetime && selectedStorageDate !== undefined && selectedStorageDate !== "" && selectedStorageId === player?.pc_specs_list?.storage?.id?.toString()) ? true : false,
          id_change: (selectedStorageId !== player?.pc_specs_list?.storage?.id?.toString()) ? true : false
        },
        power_supply: {
          id: selectedPowerSupplyId !== 'none' ? parseInt(selectedPowerSupplyId) : undefined,
          usage_start_datetime: selectedPowerSupplyDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.power_supply?.id)?.usage_start_datetime || undefined,
          old_id: (selectedPowerSupplyId !== player?.pc_specs_list?.power_supply?.id?.toString() || selectedPowerSupplyDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.power_supply?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.power_supply?.id || (selectedPowerSupplyId !== 'none' ? parseInt(selectedPowerSupplyId) : undefined)) : undefined,
          data_change: (selectedPowerSupplyDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.power_supply?.id)?.usage_start_datetime && selectedPowerSupplyDate !== undefined && selectedPowerSupplyDate !== "" && selectedPowerSupplyId === player?.pc_specs_list?.power_supply?.id?.toString()) ? true : false,
          id_change: (selectedPowerSupplyId !== player?.pc_specs_list?.power_supply?.id?.toString()) ? true : false
        },
        case: {
          id: selectedCaseId !== 'none' ? parseInt(selectedCaseId) : undefined,
          usage_start_datetime: selectedCaseDate || player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.case?.id)?.usage_start_datetime || undefined,
          old_id: (selectedCaseId !== player?.pc_specs_list?.case?.id?.toString() || selectedCaseDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.case?.id)?.usage_start_datetime) ? (player?.pc_specs_list?.case?.id || (selectedCaseId !== 'none' ? parseInt(selectedCaseId) : undefined)) : undefined,
          data_change: (selectedCaseDate !== player?.product_usage_logs.find(log => log.product_id === player?.pc_specs_list?.case?.id)?.usage_start_datetime && selectedCaseDate !== undefined && selectedCaseDate !== "" && selectedCaseId === player?.pc_specs_list?.case?.id?.toString()) ? true : false,
          id_change: (selectedCaseId !== player?.pc_specs_list?.case?.id?.toString()) ? true : false
        }
      }

      const gearListData = {
        id: gearListId || undefined,
        headset: {
          id: selectedHeadsetId !== 'none' ? parseInt(selectedHeadsetId) : undefined,
          usage_start_datetime: selectedHeadsetDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.headset?.id)?.usage_start_datetime || undefined,
          old_id: (selectedHeadsetId !== player?.gear_list?.headset?.id?.toString() || selectedHeadsetDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.headset?.id)?.usage_start_datetime) ? (player?.gear_list?.headset?.id || (selectedHeadsetId !== 'none' ? parseInt(selectedHeadsetId) : undefined)) : undefined,
          data_change: (selectedHeadsetDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.headset?.id)?.usage_start_datetime && selectedHeadsetDate !== undefined && selectedHeadsetDate !== "" && selectedHeadsetId === player?.gear_list?.headset?.id?.toString()) ? true : false,
          id_change: (selectedHeadsetId !== player?.gear_list?.headset?.id?.toString()) ? true : false
        },
        keyboard: {
          id: selectedKeyboardId !== 'none' ? parseInt(selectedKeyboardId) : undefined,
          usage_start_datetime: selectedKeyboardDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.keyboard?.id)?.usage_start_datetime || undefined,
          old_id: (selectedKeyboardId !== player?.gear_list?.keyboard?.id?.toString() || selectedKeyboardDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.keyboard?.id)?.usage_start_datetime) ? (player?.gear_list?.keyboard?.id || (selectedKeyboardId !== 'none' ? parseInt(selectedKeyboardId) : undefined)) : undefined,
          data_change: (selectedKeyboardDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.keyboard?.id)?.usage_start_datetime && selectedKeyboardDate !== undefined && selectedKeyboardDate !== "" && selectedKeyboardId === player?.gear_list?.keyboard?.id?.toString()) ? true : false,
          id_change: (selectedKeyboardId !== player?.gear_list?.keyboard?.id?.toString()) ? true : false
        },
        mouse: {
          id: selectedMouseId !== 'none' ? parseInt(selectedMouseId) : undefined,
          usage_start_datetime: selectedMouseDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mouse?.id)?.usage_start_datetime || undefined,
          old_id: (selectedMouseId !== player?.gear_list?.mouse?.id?.toString() || selectedMouseDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mouse?.id)?.usage_start_datetime) ? (player?.gear_list?.mouse?.id || (selectedMouseId !== 'none' ? parseInt(selectedMouseId) : undefined)) : undefined,
          data_change: (selectedMouseDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mouse?.id)?.usage_start_datetime && selectedMouseDate !== undefined && selectedMouseDate !== "" && selectedMouseId === player?.gear_list?.mouse?.id?.toString()) ? true : false,
          id_change: (selectedMouseId !== player?.gear_list?.mouse?.id?.toString()) ? true : false
        },
        mousepad: {
          id: selectedMousepadId !== 'none' ? parseInt(selectedMousepadId) : undefined,
          usage_start_datetime: selectedMousepadDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mousepad?.id)?.usage_start_datetime || undefined,
          old_id: (selectedMousepadId !== player?.gear_list?.mousepad?.id?.toString() || selectedMousepadDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mousepad?.id)?.usage_start_datetime) ? (player?.gear_list?.mousepad?.id || (selectedMousepadId !== 'none' ? parseInt(selectedMousepadId) : undefined)) : undefined,
          data_change: (selectedMousepadDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.mousepad?.id)?.usage_start_datetime && selectedMousepadDate !== undefined && selectedMousepadDate !== "" && selectedMousepadId === player?.gear_list?.mousepad?.id?.toString()) ? true : false,
          id_change: (selectedMousepadId !== player?.gear_list?.mousepad?.id?.toString()) ? true : false
        },
        monitor: {
          id: selectedMonitorId !== 'none' ? parseInt(selectedMonitorId) : undefined,
          usage_start_datetime: selectedMonitorDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.monitor?.id)?.usage_start_datetime || undefined,
          old_id: (selectedMonitorId !== player?.gear_list?.monitor?.id?.toString() || selectedMonitorDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.monitor?.id)?.usage_start_datetime) ? (player?.gear_list?.monitor?.id || (selectedMonitorId !== 'none' ? parseInt(selectedMonitorId) : undefined)) : undefined,
          data_change: (selectedMonitorDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.monitor?.id)?.usage_start_datetime && selectedMonitorDate !== undefined && selectedMonitorDate !== "" && selectedMonitorId === player?.gear_list?.monitor?.id?.toString()) ? true : false,
          id_change: (selectedMonitorId !== player?.gear_list?.monitor?.id?.toString()) ? true : false
        },
        earphones: {
          id: selectedEarphonesId !== 'none' ? parseInt(selectedEarphonesId) : undefined,
          usage_start_datetime: selectedEarphonesDate || player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.earphones?.id)?.usage_start_datetime || undefined,
          old_id: (selectedEarphonesId !== player?.gear_list?.earphones?.id?.toString() || selectedEarphonesDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.earphones?.id)?.usage_start_datetime) ? (player?.gear_list?.earphones?.id || (selectedEarphonesId !== 'none' ? parseInt(selectedEarphonesId) : undefined)) : undefined,
          data_change: (selectedEarphonesDate !== player?.product_usage_logs.find(log => log.product_id === player?.gear_list?.earphones?.id)?.usage_start_datetime && selectedEarphonesDate !== undefined && selectedEarphonesDate !== "" && selectedEarphonesId === player?.gear_list?.earphones?.id?.toString()) ? true : false,
          id_change: (selectedEarphonesId !== player?.gear_list?.earphones?.id?.toString()) ? true : false
        }
      }

      const setupStreamingListData = {
        id: setupStreamingListId || undefined,
        chair: {
          id: selectedChairId !== 'none' ? parseInt(selectedChairId) : undefined,
          usage_start_datetime: selectedChairDate || player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.chair?.id)?.usage_start_datetime || undefined,
          old_id: (selectedChairId !== player?.setup_streaming_list?.chair?.id?.toString() || selectedChairDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.chair?.id)?.usage_start_datetime) ? (player?.setup_streaming_list?.chair?.id || (selectedChairId !== 'none' ? parseInt(selectedChairId) : undefined)) : undefined,
          data_change: (selectedChairDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.chair?.id)?.usage_start_datetime && selectedChairDate !== undefined && selectedChairDate !== "" && selectedChairId === player?.setup_streaming_list?.chair?.id?.toString()) ? true : false,
          id_change: (selectedChairId !== player?.setup_streaming_list?.chair?.id?.toString()) ? true : false
        },
        microphone: {
          id: selectedMicrophoneId !== 'none' ? parseInt(selectedMicrophoneId) : undefined,
          usage_start_datetime: selectedMicrophoneDate || player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.microphone?.id)?.usage_start_datetime || undefined,
          old_id: (selectedMicrophoneId !== player?.setup_streaming_list?.microphone?.id?.toString() || selectedMicrophoneDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.microphone?.id)?.usage_start_datetime) ? (player?.setup_streaming_list?.microphone?.id || (selectedMicrophoneId !== 'none' ? parseInt(selectedMicrophoneId) : undefined)) : undefined,
          data_change: (selectedMicrophoneDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.microphone?.id)?.usage_start_datetime && selectedMicrophoneDate !== undefined && selectedMicrophoneDate !== "" && selectedMicrophoneId === player?.setup_streaming_list?.microphone?.id?.toString()) ? true : false,
          id_change: (selectedMicrophoneId !== player?.setup_streaming_list?.microphone?.id?.toString()) ? true : false
        },
        camera: {
          id: selectedCameraId !== 'none' ? parseInt(selectedCameraId) : undefined,
          usage_start_datetime: selectedCameraDate || player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.camera?.id)?.usage_start_datetime || undefined,
          old_id: (selectedCameraId !== player?.setup_streaming_list?.camera?.id?.toString() || selectedCameraDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.camera?.id)?.usage_start_datetime) ? (player?.setup_streaming_list?.camera?.id || (selectedCameraId !== 'none' ? parseInt(selectedCameraId) : undefined)) : undefined,
          data_change: (selectedCameraDate !== player?.product_usage_logs.find(log => log.product_id === player?.setup_streaming_list?.camera?.id)?.usage_start_datetime && selectedCameraDate !== undefined && selectedCameraDate !== "" && selectedCameraId === player?.setup_streaming_list?.camera?.id?.toString()) ? true : false,
          id_change: (selectedCameraId !== player?.setup_streaming_list?.camera?.id?.toString()) ? true : false
        }
      }

      const valid = await urlForm.trigger()
      if (!valid) {
        throw new Error('Please correct invalid URLs')
      }
      const urlValues = urlForm.getValues()

      const user_urls = {
        youtube: urlValues.url_youtube || '',
        twitter: urlValues.url_twitter || '',
        twitch: urlValues.url_twitch || '',
        tiktok: urlValues.url_tiktok || '',
        instagram: urlValues.url_instagram || '',
        discord: urlValues.url_discord || '',
        steam: urlValues.url_steam || ''
      }

      if (playerFileImg) {
        if (player?.player_img) {
          try {
            await remove({ url: player?.player_img })
          } catch (err) {
            console.error('Failed to delete previous image', err)
          }
        }
        const url = await uploadFileAndGetUrl(playerFileImg)
        if (url) formData.player_img = url
      }

      if (pcFileImg) {
        if (player?.pc_image) {
          try {
            await remove({ url: player.pc_image })
          } catch (err) {
            console.error('Failed to delete previous PC image', err)
          }
        }
        const pcUrl = await uploadFileAndGetUrl(pcFileImg)
        if (pcUrl) formData.pc_image = pcUrl
      }


      const { country_id: _omitCountryId, team: _omitTeam, game_id: _omitGameId, ...pureFormData } = formData

      const playerData = {
        ...pureFormData,
        country_id: selectedCountryId || undefined,
        user_urls: user_urls,
        pc_specs_list_id: pcSpecsListId || undefined,
        team_id: selectedTeamId || undefined,
        game_id: selectedGameId || undefined,
        gear_list_id: gearListId || undefined,
        setup_streaming_list_id: setupStreamingListId || undefined,
        gear_list: gearListData,
        pc_specs_list: pcSpecsListData,
        setup_streaming_list: setupStreamingListData,
        skins: selectedSkins,
        custom_product_reletion: finaliCustProducts,
      }

      await onSave(playerData, mode)
      console.log("Player saved successfully!")
      onOpenChange(false)
    } catch (error) {
      console.log("Error", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof PlayerCreate, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'birthday' && value === '' ? undefined : value
    }))
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Player' : 'Edit Player'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Fill in the information to create a new player.' 
              : 'Update the player information.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...urlForm}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="player_name" className="text-left">
                Player Name *
              </Label>
              <Input
                id="player_name"
                value={formData.player_name}
                onChange={(e) => handleInputChange("player_name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="player_img" className="text-left flex items-center gap-2">
                Image URL
              </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <Button type="button" onClick={handleUploadAvatarClick}>
                    Upload Image
                  </Button>
                  {playerFileImg && previewUrl && (
                    <div className="flex items-center gap-2">
                      <img src={previewUrl} alt="selected" className="h-10 w-10 object-cover rounded" />
                      <span className="text-xs break-all max-w-[120px] line-clamp-1" title={playerFileImg.name}>{playerFileImg.name}</span>
                    </div>
                  )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Team</Label>
              <div className="col-span-3">
                <Select
                  value={selectedTeamId?.toString() || "none"}
                  onValueChange={(value) => {
                    if (value && value !== "none") {
                      const id = parseInt(value)
                      setSelectedTeamId(id)
                      const obj = teams.find(t => t.id === id) || null
                      setSelectedTeamObj(obj)
                      setFormData(prev => ({ ...prev, team: obj?.name || "" }))
                    } else {
                      setSelectedTeamId(null)
                      setSelectedTeamObj(null)
                      setFormData(prev => ({ ...prev, team: "" }))
                    }
                  }}
                  onOpenChange={handleTeamSelectOpenChange}
                >
                  <SelectTrigger className="w-full">
                    {selectedTeamObj ? (
                      <span className="text-sm font-medium">{selectedTeamObj.name}</span>
                    ) : (
                      <span className="text-muted-foreground">Select Team</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="none">Not selected</SelectItem>
                    {teams.map((t: TeamRead) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Game</Label>
              <div className="col-span-3">
                <Select
                  value={selectedGameId?.toString() || "none"}
                  onValueChange={(value) => {
                    if (value && value !== "none") {
                      const id = parseInt(value)
                      setSelectedGameId(id)
                      const obj = gamesList.find(g => g.id === id) || null
                      setSelectedGameObj(obj)
                    } else {
                      setSelectedGameId(null)
                      setSelectedGameObj(null)
                    }
                  }}
                  onOpenChange={handleGameSelectOpenChange}
                >
                  <SelectTrigger className="w-full">
                    {selectedGameObj ? (
                      <span className="text-sm font-medium">{selectedGameObj.name}</span>
                    ) : (
                      <span className="text-muted-foreground">Select Game</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="none">Not selected</SelectItem>
                    {gamesList.map((g: GameBase) => (
                      <SelectItem key={g.id} value={g.id!.toString()}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-left">
                Birthday
              </Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="info" className="text-left">
                Info
              </Label>
              <Textarea
                id="info"
                value={formData.info}
                onChange={(e) => handleInputChange("info", e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="Additional information about the player..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-left">
                Notes
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="Notes about the player..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pc_image_name" className="text-left">
                PC Image Name
              </Label>
              <Input id="pc_image_name" value={formData.pc_image_name} onChange={(e) => handleInputChange("pc_image_name", e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pc_image" className="text-left">
                PC Image
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={pcInputRef}
                  className="hidden"
                  onChange={handlePcFileChange}
                />
                <Button type="button" onClick={handleUploadPcClick}>
                  Upload PC Image
                </Button>
                {pcPreviewUrl && (
                  <div className="flex items-center gap-2">
                    <img src={pcPreviewUrl} alt="selected" className="h-10 w-10 object-cover rounded" />
                    <span className="text-xs break-all max-w-[120px] line-clamp-1" title={formData.pc_image_name}>{formData.pc_image_name}</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url_discord" className="text-left">
                Discord URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_discord"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_discord" placeholder="https://discord.gg/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_instagram" className="text-left">
                Instagram URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_instagram"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_instagram" placeholder="https://www.instagram.com/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_steam" className="text-left">
                Steam URL
              </Label>
              <FormField
                name="url_steam"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_steam" placeholder="https://steamcommunity.com/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_tiktok" className="text-left">
                TikTok URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_tiktok"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_tiktok" placeholder="https://www.tiktok.com/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_twitch" className="text-left">
                Twitch URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_twitch"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_twitch" placeholder="https://www.twitch.tv/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_twitter" className="text-left">
                Twitter URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_twitter"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_twitter" placeholder="https://x.com/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor="url_youtube" className="text-left">
                YouTube URL
              </Label>
              <FormField
                control={urlForm.control}
                name="url_youtube"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input id="url_youtube" placeholder="https://www.youtube.com/..." value={field.value || ''} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {mode === 'edit' && (
            <div>
                <Label htmlFor="info" className="text-left font-bold">
                    PC Specs
                </Label>
                <div className="pt-4 grid grid-cols-2 items-center gap-4">
                    <SelectListProductNew
                    label="CPU"
                    selectedProduct={player?.pc_specs_list?.cpu || null}
                    value={selectedCpuId}
                    onValueChange={(value, date) => {
                      setSelectedCpuId(value);
                      setSelectedCpuDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedCpuDate}
                    category="cpu"
                    placeholder="Select CPU"   
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="CPU Cooler"
                    selectedProduct={player?.pc_specs_list?.cpu_cooler || null}
                    value={selectedCpuCoolerId}
                    onValueChange={(value, date) => {
                      setSelectedCpuCoolerId(value);
                      setSelectedCpuCoolerDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedCpuCoolerDate}
                    category="cpu_cooler"
                    placeholder="Select CPU Cooler"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="GPU"
                    selectedProduct={player?.pc_specs_list?.gpu || null}
                    value={selectedGpuId}
                    onValueChange={(value, date) => {
                      setSelectedGpuId(value);
                      setSelectedGpuDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedGpuDate}
                    category="gpu"
                    placeholder="Select GPU"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Motherboard"
                    selectedProduct={player?.pc_specs_list?.motherboard || null}
                    value={selectedMotherboardId}
                    onValueChange={(value, date) => {
                      setSelectedMotherboardId(value);
                      setSelectedMotherboardDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedMotherboardDate}
                    category="motherboard"
                    placeholder="Select Motherboard"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="RAM"
                    selectedProduct={player?.pc_specs_list?.ram || null}
                    value={selectedRamId}
                    onValueChange={(value, date) => {
                      setSelectedRamId(value);
                      setSelectedRamDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedRamDate}
                    category="ram"
                    placeholder="Select RAM"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Storage"
                    selectedProduct={player?.pc_specs_list?.storage || null}
                    value={selectedStorageId}
                    onValueChange={(value, date) => {
                      setSelectedStorageId(value);
                      setSelectedStorageDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedStorageDate}
                    category="storage"
                    placeholder="Select Storage"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Power Supply"
                    selectedProduct={player?.pc_specs_list?.power_supply || null}
                    value={selectedPowerSupplyId}
                    onValueChange={(value, date) => {
                      setSelectedPowerSupplyId(value);
                      setSelectedPowerSupplyDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedPowerSupplyDate}
                    category="power_supply"
                    placeholder="Select Power Supply"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Case"
                    selectedProduct={player?.pc_specs_list?.case || null}
                    value={selectedCaseId}
                    onValueChange={(value, date) => {
                      setSelectedCaseId(value);
                      setSelectedCaseDate(date || "");
                    }}
                    usageProductLogs={player?.product_usage_logs}
                    selectedDate={selectedCaseDate}
                    category="case"
                    placeholder="Select Case"
                    periphery_flag={false}
                    />
                </div>
            </div>
            )}
          </div>
          {mode === 'edit' && (
            <div>
              <Label htmlFor="info" className="text-left font-bold">
                Custom Product Reletion
              </Label>
              <SelectCustProducts 
                onCustProductsChange={setFinaliCustProducts}
                selectedCustProducts={selectedCustProducts}
              />
            </div>
          )}
          {mode === 'edit' && (
          <div>
            <Label htmlFor="info" className="text-left font-bold">
                Gear List
            </Label>
            <div className="pt-4 grid grid-cols-2 items-center gap-4">
                <SelectListProductNew
                label="Headset"
                selectedProduct={player?.gear_list?.headset || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedHeadsetId}
                createdDate={player?.created_at}
                onValueChange={(value, date) => {
                  setSelectedHeadsetId(value);
                  setSelectedHeadsetDate(date || "");
                }}
                selectedDate={selectedHeadsetDate}
                category="headset"
                placeholder="Select Headset"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Keyboard"
                selectedProduct={player?.gear_list?.keyboard || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedKeyboardId}
                onValueChange={(value, date) => {
                  setSelectedKeyboardId(value);
                  setSelectedKeyboardDate(date || "");
                }}
                selectedDate={selectedKeyboardDate}
                category="keyboard"
                placeholder="Select Keyboard"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Mouse"
                selectedProduct={player?.gear_list?.mouse || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedMouseId}
                onValueChange={(value, date) => {
                  setSelectedMouseId(value);
                  setSelectedMouseDate(date || "");
                }}
                selectedDate={selectedMouseDate}
                category="mouse"
                placeholder="Select Mouse"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Mousepad"
                selectedProduct={player?.gear_list?.mousepad || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedMousepadId}
                onValueChange={(value, date) => {
                  setSelectedMousepadId(value);
                  setSelectedMousepadDate(date || "");
                }}
                selectedDate={selectedMousepadDate}
                category="mousepad"
                placeholder="Select Mousepad"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Monitor"
                selectedProduct={player?.gear_list?.monitor || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedMonitorId}
                onValueChange={(value, date) => {
                  setSelectedMonitorId(value);
                  setSelectedMonitorDate(date || "");
                }}
                selectedDate={selectedMonitorDate}
                category="monitor"
                placeholder="Select Monitor"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Earphones"
                selectedProduct={player?.gear_list?.earphones || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedEarphonesId}
                onValueChange={(value, date) => {
                  setSelectedEarphonesId(value);
                  setSelectedEarphonesDate(date || "");
                }}
                selectedDate={selectedEarphonesDate}
                category="earphones"
                placeholder="Select Earphones"
                periphery_flag={true}
                />
            </div>
          </div>
          )}
    
          {mode === 'edit' && (
          <div>
            <Label htmlFor="info" className="text-left font-bold">
                Setup & Stream
            </Label>
            <div className="pt-4 grid grid-cols-2 items-center gap-4">
               <SelectListProductNew
                label="Chair"
                selectedProduct={player?.setup_streaming_list?.chair || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedChairId}
                onValueChange={(value, date) => {
                  setSelectedChairId(value);
                  setSelectedChairDate(date || "");
                }}
                selectedDate={selectedChairDate}
                category="chair"
                placeholder="Select Chair"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Microphone"
                selectedProduct={player?.setup_streaming_list?.microphone || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedMicrophoneId}
                onValueChange={(value, date) => {
                  setSelectedMicrophoneId(value);
                  setSelectedMicrophoneDate(date || "");
                }}
                selectedDate={selectedMicrophoneDate}
                category="microphone"
                placeholder="Select Microphone"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Camera"
                selectedProduct={player?.setup_streaming_list?.camera || null}
                usageProductLogs={player?.product_usage_logs}
                value={selectedCameraId}
                onValueChange={(value, date) => {
                  setSelectedCameraId(value);
                  setSelectedCameraDate(date || "");
                }}
                selectedDate={selectedCameraDate}
                category="camera"
                placeholder="Select Camera"
                periphery_flag={true}
                />
            </div>
          </div>
          )}

          {mode === 'edit' && (
            <div>
              <Label htmlFor="info" className="text-left font-bold">
                Skins
              </Label>
              <SelectSkinList 
                onSkinsChange={setSelectedSkins}
                selectedSkins={player?.skins || []}
            />
            </div>
          )}
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === 'add' ? "Create Player" : "Update Player"}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 