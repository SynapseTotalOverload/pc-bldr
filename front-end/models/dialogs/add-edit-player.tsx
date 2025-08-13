import { useState, useEffect } from "react"
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
import { PlayerCreate, PlayerUpdate, PlayerWithRelations } from "@/types/players-base"
import { useToast } from "@/hooks/use-toast"
import { createPCSpecsList, updatePCSpecsList } from "@/lib/pc-specs-lists-api"
import { createGearList, updateGearList } from "@/lib/gear-lists-api"
import { createSetupStreamingList, updateSetupStreamingList } from "@/lib/setup-streaming-lists-api"
import { SelectListProductNew } from '@/components/ui/select-list-product-new'
import { SkinRead, SkinReadWithAttributes } from "@/lib/skins-api"
import { SelectSkinList } from "@/components/ui/select-skin-list"


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
    country: "",
    name: "",
    birthday: undefined,
    info: "",
    note: ""
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
  
  const urlFormSchema = z.object({
    player_img: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_youtube: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_twitch: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_tiktok: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_instagram: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    url_discord: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  })
  type UrlFormData = z.infer<typeof urlFormSchema>

  const urlForm = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      player_img: '',
      url_youtube: '',
      url_twitter: '',
      url_twitch: '',
      url_tiktok: '',
      url_instagram: '',
      url_discord: '',
    },
  })

  const { toast } = useToast()

  useEffect(() => {
    if (open && player && mode === 'edit') {
      setFormData({
        player_name: player.player_name || "",
        player_img: player.player_img || "",
        team: player.team || "",
        country: player.country || "",
        name: player.name || "",
        birthday: player.birthday || undefined,
        info: player.info || "",
        note: player.note || "",
        user_urls: player.user_urls || {
          youtube: "",
          twitter: "",
          twitch: "",
          tiktok: "",
          instagram: "",
          discord: ""
        }
      })
      console.log("player", player)
      urlForm.reset({
        player_img: player.player_img || '',
        url_youtube: player.user_urls?.youtube || '',
        url_twitter: player.user_urls?.twitter || '',
        url_twitch: player.user_urls?.twitch || '',
        url_tiktok: player.user_urls?.tiktok || '',
        url_instagram: player.user_urls?.instagram || '',
        url_discord: player.user_urls?.discord || '',
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
    } else if (open && mode === 'add') {
      setFormData({
        player_name: "",
        player_img: "",
        team: "",
        country: "",
        name: "",
        birthday: undefined,
        info: "",
        note: ""
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
        player_img: '',
        url_youtube: '',
        url_twitter: '',
        url_twitch: '',
        url_tiktok: '',
        url_instagram: '',
        url_discord: '',
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
    }
  }, [player, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (mode === 'add' && (!formData.player_name || formData.player_name.trim().length === 0)) {
        throw new Error('Player Name is required')
      }

      // Validate URL fields with RHF/Zod (as in Skins dialog)
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
        discord: urlValues.url_discord || ''
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


      const playerData = {
        ...formData,
        player_img: (urlValues.player_img || '').toString(),
        user_urls: user_urls,
        pc_specs_list_id: pcSpecsListId || undefined,
        gear_list_id: gearListId || undefined,
        setup_streaming_list_id: setupStreamingListId || undefined,
        gear_list: gearListData,
        pc_specs_list: pcSpecsListData,
        setup_streaming_list: setupStreamingListData,
        skins: selectedSkins,
      }

      await onSave(playerData, mode)
      toast({
        title: "Success",
        description: mode === 'add' ? "Player created successfully!" : "Player updated successfully!",
      })
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

    if (field === 'player_img') {
      urlForm.setValue('player_img', value ?? '')
    }
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
              <Label htmlFor="player_img" className="text-left">
                Image URL
              </Label>
              <FormField
                control={urlForm.control}
                name="player_img"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input
                        id="player_img"
                        placeholder="https://example.com/image.jpg"
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange('player_img', e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-left">
                Team
              </Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => handleInputChange("team", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-left">
                Country
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="col-span-3"
              />
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
                label="Skins"
                placeholder="Select skins"
                searchPlaceholder="Search skins..."
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