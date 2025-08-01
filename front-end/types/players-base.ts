export interface PlayerBase {
  player_name: string;
  player_img?: string;
  team?: string;
  country?: string;
  name?: string;
  birthday?: string;
  info?: string;
}

export interface PlayerCreate extends PlayerBase {
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
}

export interface PlayerUpdate extends Partial<PlayerBase> {
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
}

export interface PlayerUpdateWithGear extends Partial<PlayerBase> {
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
  setup_streaming_list?: {
    chair_id?: number | null;
    microphone_id?: number | null;
    camera_id?: number | null;
  };
  gear_list?: {
    monitor_id?: number | null;
    mouse_id?: number | null;
    keyboard_id?: number | null;
    headset_id?: number | null;
    mousepad_id?: number | null;
    earphones_id?: number | null;
  };
  pc_specs_list?: {
    cpu_id?: number | null;
    cpu_cooler_id?: number | null;
    gpu_id?: number | null;
    motherboard_id?: number | null;
    ram_id?: number | null;
    storage_id?: number | null;
    power_supply_id?: number | null;
    case_id?: number | null;
  };
}

export interface PlayerRead extends PlayerBase {
  id: number;
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerWithRelations extends PlayerRead {
  gear_list?: any;
  pc_specs_list?: any;
  setup_streaming_list?: any;
  skins: any[];
}

export interface PlayerSkinsBatch {
  skin_ids: number[];
}

export interface PlayersResponse {
  items: PlayerWithRelations[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}
