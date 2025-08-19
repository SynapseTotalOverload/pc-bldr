import { Country } from "./country";
import { GameBase } from "./game-base";

export interface PlayerBase {
  id?: number;
  player_name: string;
  player_img?: string;
  team?: string;
  country_id?: number;
  name?: string;
  birthday?: string;
  info?: string;
  note?: string;
  pc_image?: string;
  pc_image_name?: string;
  user_urls?: {
    youtube?: string;
    twitter?: string;
    twitch?: string;
    tiktok?: string;
    instagram?: string;
    discord?: string;
    steam?: string;
  };
  game?: {
    id?: number;
    name?: string;
  };
}

export interface PlayerCreate extends PlayerBase {
  game_id?: number;
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
}

export interface PlayerUpdate extends Partial<PlayerBase> {
  game_id?: number;
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
  custom_product_reletion?: CustomProductReletionSimple[];
}

export interface CustomProductReletionSimple {
  id?: number;
  user_id?: number;
  original_name?: string;
  product_id?: number;
  custom_name?: string;
  pozition?: string;
  data?: string;
  high_image_url?: string;
  low_image_url?: string;
}

export interface CustomProductReletion {
  create_list?: {
    product_id: number;
    original_name: string;
    custom_name?: string;
    pozition: string;
    data: string;
  }[];
  update_list?: {
    id: number;
    custom_name: string;
  }[];
  delete_list?: string[];
}

export interface PlayerRead extends PlayerBase {
  id: number;
  country?: Country;
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
  product_usage_logs: ProductUsageLog[];
  custom_product_reletion?: CustomProductReletionSimple[];
  game?: GameBase;
}

export interface ProductUsageLog {
  product_id: number;
  usage_start_datetime: string;
  usage_end_datetime: string;
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
