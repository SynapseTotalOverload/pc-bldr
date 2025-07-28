export interface PlayerBase {
  player_name: string;
  player_img?: string;
  team?: string;
  country?: string;
  name?: string;
  birthday?: string;
  info?: string;
}

export interface PlayerCreate extends PlayerBase {}

export interface PlayerUpdate extends Partial<PlayerBase> {
  gear_list_id?: number;
  pc_specs_list_id?: number;
  setup_streaming_list_id?: number;
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
