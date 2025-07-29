import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlayerCreate, PlayerUpdate, PlayerWithRelations } from "@/types/players-base"
import { useToast } from "@/hooks/use-toast"
import { createPCSpecsList, updatePCSpecsList } from "@/lib/pc-specs-lists-api"
import { createGearList, updateGearList } from "@/lib/gear-lists-api"
import { createSetupStreamingList, updateSetupStreamingList } from "@/lib/setup-streaming-lists-api"
import { SelectListProductNew } from '@/components/ui/select-list-product-new'
import { SkinRead } from "@/lib/skins-api"
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
    birthday: "",
    info: ""
  })
  const [selectedCpuId, setSelectedCpuId] = useState<string>("none")
  const [selectedCpuCoolerId, setSelectedCpuCoolerId] = useState<string>("none")
  const [selectedGpuId, setSelectedGpuId] = useState<string>("none")
  const [selectedMotherboardId, setSelectedMotherboardId] = useState<string>("none")
  const [selectedRamId, setSelectedRamId] = useState<string>("none")
  const [selectedStorageId, setSelectedStorageId] = useState<string>("none")
  const [selectedPowerSupplyId, setSelectedPowerSupplyId] = useState<string>("none")
  const [selectedCaseId, setSelectedCaseId] = useState<string>("none")
  const [pcSpecsListId, setPcSpecsListId] = useState<number | null>(null)
  const [skinsListId, setSkinsListId] = useState<number | null>(null)
  const [selectedSkins, setSelectedSkins] = useState<SkinRead[]>([])


  const [selectedHeadsetId, setSelectedHeadsetId] = useState<string>("none")
  const [selectedKeyboardId, setSelectedKeyboardId] = useState<string>("none")
  const [selectedMouseId, setSelectedMouseId] = useState<string>("none")
  const [selectedMousepadId, setSelectedMousepadId] = useState<string>("none")
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>("none")

  const [selectedChairId, setSelectedChairId] = useState<string>("none")

  const [gearListId, setGearListId] = useState<number | null>(null)
  const [setupStreamingListId, setSetupStreamingListId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && player && mode === 'edit') {
      setFormData({
        player_name: player.player_name || "",
        player_img: player.player_img || "",
        team: player.team || "",
        country: player.country || "",
        name: player.name || "",
        birthday: player.birthday || "",
        info: player.info || ""
      })
      
      if (player.pc_specs_list) {
        setPcSpecsListId(player.pc_specs_list.id)
        
        // Check if we have full product objects or just IDs
        if (player.pc_specs_list.cpu_id) {
          setSelectedCpuId(player.pc_specs_list.cpu_id.toString())
        } else if (player.pc_specs_list.cpu?.id) {
          setSelectedCpuId(player.pc_specs_list.cpu.id.toString())
        } else {
          setSelectedCpuId("none")
        }
        
        if (player.pc_specs_list.cpu_cooler_id) {
          setSelectedCpuCoolerId(player.pc_specs_list.cpu_cooler_id.toString())
        } else if (player.pc_specs_list.cpu_cooler?.id) {
          setSelectedCpuCoolerId(player.pc_specs_list.cpu_cooler.id.toString())
        } else {
          setSelectedCpuCoolerId("none")
        }
        
        if (player.pc_specs_list.gpu_id) {
          setSelectedGpuId(player.pc_specs_list.gpu_id.toString())
        } else if (player.pc_specs_list.gpu?.id) {
          setSelectedGpuId(player.pc_specs_list.gpu.id.toString())
        }
        
        if (player.pc_specs_list.motherboard_id) {
          setSelectedMotherboardId(player.pc_specs_list.motherboard_id.toString())
        } else if (player.pc_specs_list.motherboard?.id) {
          setSelectedMotherboardId(player.pc_specs_list.motherboard.id.toString())
        }
        
        if (player.pc_specs_list.ram_id) {
          setSelectedRamId(player.pc_specs_list.ram_id.toString())
        } else if (player.pc_specs_list.ram?.id) {
          setSelectedRamId(player.pc_specs_list.ram.id.toString())
        }
        
        if (player.pc_specs_list.storage_id) {
          setSelectedStorageId(player.pc_specs_list.storage_id.toString())
        } else if (player.pc_specs_list.storage?.id) {
          setSelectedStorageId(player.pc_specs_list.storage.id.toString())
        }
        
        if (player.pc_specs_list.power_supply_id) {
          setSelectedPowerSupplyId(player.pc_specs_list.power_supply_id.toString())
        } else if (player.pc_specs_list.power_supply?.id) {
          setSelectedPowerSupplyId(player.pc_specs_list.power_supply.id.toString())
        }
        
        if (player.pc_specs_list.case_id) {
          setSelectedCaseId(player.pc_specs_list.case_id.toString())
        } else if (player.pc_specs_list.case?.id) {
          setSelectedCaseId(player.pc_specs_list.case.id.toString())
        }
      
      } else {
        setPcSpecsListId(null)
        setSelectedCpuId("none")
        setSelectedCpuCoolerId("none")
        setSelectedGpuId("none")
        setSelectedMotherboardId("none")
        setSelectedRamId("none")
        setSelectedStorageId("none")
        setSelectedPowerSupplyId("none")
        setSelectedCaseId("none")
      }

      if (player.gear_list) {
        setGearListId(player.gear_list.id)
        
        if (player.gear_list.headset_id) {
          setSelectedHeadsetId(player.gear_list.headset_id.toString())
        } else if (player.gear_list.headset?.id) {
          setSelectedHeadsetId(player.gear_list.headset.id.toString())
        } else {
          setSelectedHeadsetId("none")
        }
        
        if (player.gear_list.keyboard_id) {
          setSelectedKeyboardId(player.gear_list.keyboard_id.toString())
        } else if (player.gear_list.keyboard?.id) {
          setSelectedKeyboardId(player.gear_list.keyboard.id.toString())
        } else {
          setSelectedKeyboardId("none")
        }
        
        if (player.gear_list.mouse_id) {
          setSelectedMouseId(player.gear_list.mouse_id.toString())
        } else if (player.gear_list.mouse?.id) {
          setSelectedMouseId(player.gear_list.mouse.id.toString())
        } else {
          setSelectedMouseId("none")
        }
        
        if (player.gear_list.mousepad_id) {
          setSelectedMousepadId(player.gear_list.mousepad_id.toString())
        } else if (player.gear_list.mousepad?.id) {
          setSelectedMousepadId(player.gear_list.mousepad.id.toString())
        } else {
          setSelectedMousepadId("none")
        }
        
        if (player.gear_list.monitor_id) {
          setSelectedMonitorId(player.gear_list.monitor_id.toString())
        } else if (player.gear_list.monitor?.id) {
          setSelectedMonitorId(player.gear_list.monitor.id.toString())
        } else {
          setSelectedMonitorId("none")
        }
      } else {
        setGearListId(null)
        setSelectedHeadsetId("none")
        setSelectedKeyboardId("none")
        setSelectedMouseId("none")
        setSelectedMousepadId("none")
        setSelectedMonitorId("none")
      }

      if (player.setup_streaming_list) {
        setSetupStreamingListId(player.setup_streaming_list.id)
        if (player.setup_streaming_list.chair_id) {
          setSelectedChairId(player.setup_streaming_list.chair_id.toString())
        } else if (player.setup_streaming_list.chair?.id) {
          setSelectedChairId(player.setup_streaming_list.chair.id.toString())
        } else {
          setSelectedChairId("none")
        }
      } else {
        setSetupStreamingListId(null)
        setSelectedChairId("none")
      }
    } else if (open && mode === 'add') {
      setFormData({
        player_name: "",
        player_img: "",
        team: "",
        country: "",
        name: "",
        birthday: "",
        info: ""
      })
      setPcSpecsListId(null)
      setSelectedCpuId("none")
      setSelectedCpuCoolerId("none")
      setSelectedGpuId("none")
      setSelectedMotherboardId("none")
      setSelectedRamId("none")
      setSelectedStorageId("none")
      setSelectedPowerSupplyId("none")
      setSelectedCaseId("none")

      setGearListId(null)
      setSelectedHeadsetId("none")
      setSelectedKeyboardId("none")
      setSelectedMouseId("none")
      setSelectedMousepadId("none")
      setSelectedMonitorId("none")

      setSetupStreamingListId(null)
      setSelectedChairId("none")

      setGearListId(null)
      setSelectedHeadsetId("none")
      setSelectedKeyboardId("none")
      setSelectedMouseId("none")
      setSelectedMousepadId("none")
      setSelectedMonitorId("none")

      setSetupStreamingListId(null)
      setSelectedChairId("none")
    }
  }, [player, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const pcSpecsListData = {
        cpu_id: selectedCpuId !== 'none' ? parseInt(selectedCpuId) : null,
        cpu_cooler_id: selectedCpuCoolerId !== 'none' ? parseInt(selectedCpuCoolerId) : null,
        gpu_id: selectedGpuId !== 'none' ? parseInt(selectedGpuId) : null,
        motherboard_id: selectedMotherboardId !== 'none' ? parseInt(selectedMotherboardId) : null,
        ram_id: selectedRamId !== 'none' ? parseInt(selectedRamId) : null,
        storage_id: selectedStorageId !== 'none' ? parseInt(selectedStorageId) : null,
        power_supply_id: selectedPowerSupplyId !== 'none' ? parseInt(selectedPowerSupplyId) : null,
        case_id: selectedCaseId !== 'none' ? parseInt(selectedCaseId) : null,
      }

      let newPcSpecsListId = pcSpecsListId
      
      // if (pcSpecsListId) {
      //   await updatePCSpecsList(pcSpecsListId, pcSpecsListData)
      // } else {
      //   const newPcSpecsList = await createPCSpecsList(pcSpecsListData)
      //   newPcSpecsListId = newPcSpecsList.id
      // }

      const gearListData = {
        headset_id: selectedHeadsetId !== 'none' ? parseInt(selectedHeadsetId) : null,
        keyboard_id: selectedKeyboardId !== 'none' ? parseInt(selectedKeyboardId) : null,
        mouse_id: selectedMouseId !== 'none' ? parseInt(selectedMouseId) : null,
        mousepad_id: selectedMousepadId !== 'none' ? parseInt(selectedMousepadId) : null,
        monitor_id: selectedMonitorId !== 'none' ? parseInt(selectedMonitorId) : null,
      }

      let newGearListId = gearListId
      // if (gearListId) {
      //   await updateGearList(gearListId, gearListData)
      // } else {
      //   const newGearList = await createGearList(gearListData)
      //   newGearListId = newGearList.id
      // }

      const setupStreamingListData = {
        chair_id: selectedChairId !== 'none' ? parseInt(selectedChairId) : null,
      }

      let newSetupStreamingListId = setupStreamingListId
      // if (setupStreamingListId) {
      //   await updateSetupStreamingList(setupStreamingListId, setupStreamingListData)
      // } else {
      //   const newSetupStreamingList = await createSetupStreamingList(setupStreamingListData)
      //   newSetupStreamingListId = newSetupStreamingList.id
      // }



      const playerData = {
        ...formData,
        pc_specs_list_id: newPcSpecsListId || undefined,
        gear_list_id: newGearListId || undefined,
        setup_streaming_list_id: newSetupStreamingListId || undefined,
        gear_list: {
          id: newGearListId || undefined,
          ...gearListData
        },
        pc_specs_list: {
          id: newPcSpecsListId || undefined,
          ...pcSpecsListData
        },
        setup_streaming_list: {
          id: newSetupStreamingListId || undefined,
          ...setupStreamingListData
        },
        skin_ids: selectedSkins.map(skin => skin.id)
      }

      await onSave(playerData, mode)
      toast({
        title: "Success",
        description: mode === 'add' ? "Player created successfully!" : "Player updated successfully!",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save player",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof PlayerCreate, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="player_img" className="text-left">
                Image URL *
              </Label>
              <Input
                id="player_img"
                value={formData.player_img}
                onChange={(e) => handleInputChange("player_img", e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-left">
                Team *
              </Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => handleInputChange("team", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-left">
                Country *
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-left ">
                Birthday *
              </Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="info" className="text-left">
                Info *
              </Label>
              <Textarea
                id="info"
                value={formData.info}
                onChange={(e) => handleInputChange("info", e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="Additional information about the player..."
                required
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
                    onValueChange={setSelectedCpuId}
                    category="cpu"
                    placeholder="Select CPU"   
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="CPU Cooler"
                    selectedProduct={player?.pc_specs_list?.cpu_cooler || null}
                    value={selectedCpuCoolerId}
                    onValueChange={setSelectedCpuCoolerId}
                    category="cpu_cooler"
                    placeholder="Select CPU Cooler"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="GPU"
                    selectedProduct={player?.pc_specs_list?.gpu || null}
                    value={selectedGpuId}
                    onValueChange={setSelectedGpuId}
                    category="gpu"
                    placeholder="Select GPU"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Motherboard"
                    selectedProduct={player?.pc_specs_list?.motherboard || null}
                    value={selectedMotherboardId}
                    onValueChange={setSelectedMotherboardId}
                    category="motherboard"
                    placeholder="Select Motherboard"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="RAM"
                    selectedProduct={player?.pc_specs_list?.ram || null}
                    value={selectedRamId}
                    onValueChange={setSelectedRamId}
                    category="ram"
                    placeholder="Select RAM"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Storage"
                    selectedProduct={player?.pc_specs_list?.storage || null}
                    value={selectedStorageId}
                    onValueChange={setSelectedStorageId}
                    category="storage"
                    placeholder="Select Storage"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Power Supply"
                    selectedProduct={player?.pc_specs_list?.power_supply || null}
                    value={selectedPowerSupplyId}
                    onValueChange={setSelectedPowerSupplyId}
                    category="power_supply"
                    placeholder="Select Power Supply"
                    periphery_flag={false}
                    />
                    <SelectListProductNew
                    label="Case"
                    selectedProduct={player?.pc_specs_list?.case || null}
                    value={selectedCaseId}
                    onValueChange={setSelectedCaseId}
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
                value={selectedHeadsetId}
                onValueChange={setSelectedHeadsetId}
                category="headset"
                placeholder="Select Headset"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Keyboard"
                selectedProduct={player?.gear_list?.keyboard || null}
                value={selectedKeyboardId}
                onValueChange={setSelectedKeyboardId}
                category="keyboard"
                placeholder="Select Keyboard"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Mouse"
                selectedProduct={player?.gear_list?.mouse || null}
                value={selectedMouseId}
                onValueChange={setSelectedMouseId}
                category="mouse"
                placeholder="Select Mouse"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Mousepad"
                selectedProduct={player?.gear_list?.mousepad || null}
                value={selectedMousepadId}
                onValueChange={setSelectedMousepadId}
                category="mousepad"
                placeholder="Select Mousepad"
                periphery_flag={true}
                />
                <SelectListProductNew
                label="Monitor"
                selectedProduct={player?.gear_list?.monitor || null}
                value={selectedMonitorId}
                onValueChange={setSelectedMonitorId}
                category="monitor"
                placeholder="Select Monitor"
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
                value={selectedChairId}
                onValueChange={setSelectedChairId}
                category="chair"
                placeholder="Select Chair"
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
      </DialogContent>
    </Dialog>
  )
} 