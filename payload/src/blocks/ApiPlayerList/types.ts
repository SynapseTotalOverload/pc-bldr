export interface PlayerWithRelations {
  id: number;
  player_name: string;
  player_img: string;
  team: string;
  country: string;
  name: string;
  birthday: string;
  info: string;
  created_at: string;
  updated_at: string;
  gear_list?: {
    id: number;
    created_at: string;
    updated_at: string;
    monitor?: { id: number; name: string; display_name: string } | null;
    mouse?: { id: number; name: string; display_name: string } | null;
    keyboard?: { id: number; name: string; display_name: string } | null;
    headset?: { id: number; name: string; display_name: string } | null;
    mousepad?: { id: number; name: string; display_name: string } | null;
    earphones?: { id: number; name: string; display_name: string } | null;
  } | null;
  pc_specs_list?: {
    id: number;
    created_at: string;
    updated_at: string;
    cpu?: { id: number; name: string; display_name: string } | null;
    cpu_cooler?: { id: number; name: string; display_name: string } | null;
    gpu?: { id: number; name: string; display_name: string } | null;
    motherboard?: { id: number; name: string; display_name: string } | null;
    ram?: { id: number; name: string; display_name: string } | null;
    storage?: { id: number; name: string; display_name: string } | null;
    power_supply?: { id: number; name: string; display_name: string } | null;
    case?: { id: number; name: string; display_name: string } | null;
  } | null;
  setup_streaming_list?: {
    id: number;
    created_at: string;
    updated_at: string;
    chair?: { id: number; name: string; display_name: string } | null;
    microphone?: { id: number; name: string; display_name: string } | null;
    webcam?: { id: number; name: string; display_name: string } | null;
  } | null;
  skins?: any[];
}

export interface PlayersResponse {
  items: PlayerWithRelations[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface ApiPlayerListBlockProps {
  title?: string;
  description?: string;
  filterBy?: 'all' | 'team' | 'country' | 'query';
  teamFilter?: string;
  countryFilter?: string;
  searchQuery?: string;
  layout?: 'grid' | 'list' | 'carousel';
  columns?: '1' | '2' | '3' | '4';
  itemsPerPage?: number;
  showPagination?: boolean;
  showPlayerInfo?: {
    showTeam?: boolean;
    showCountry?: boolean;
    showBirthday?: boolean;
    showInfo?: boolean;
    showGearList?: boolean;
    showPcSpecs?: boolean;
    showSkins?: boolean;
  };
  styling?: {
    backgroundColor?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted';
    cardStyle?: 'default' | 'elevated' | 'bordered' | 'minimal';
    imageStyle?: 'rounded' | 'square' | 'circle';
  };
}
  