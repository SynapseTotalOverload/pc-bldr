// Skin category constants based on backend
export const SKIN_CATEGORIES = {
  KNIVES: 1,
  GLOVES: 2,
  PISTOLS: 3,
  RIFLES: 4,
  SMG: 5,
  HEAVY: 6,
} as const;

export const SKIN_CATEGORY_NAMES = {
  [SKIN_CATEGORIES.KNIVES]: 'knives',
  [SKIN_CATEGORIES.GLOVES]: 'gloves',
  [SKIN_CATEGORIES.PISTOLS]: 'pistols',
  [SKIN_CATEGORIES.RIFLES]: 'rifles',
  [SKIN_CATEGORIES.SMG]: 'smg',
  [SKIN_CATEGORIES.HEAVY]: 'heavy',
} as const;

export const SKIN_CATEGORY_DISPLAY_NAMES = {
  [SKIN_CATEGORIES.KNIVES]: 'Knives',
  [SKIN_CATEGORIES.GLOVES]: 'Gloves',
  [SKIN_CATEGORIES.PISTOLS]: 'Pistols',
  [SKIN_CATEGORIES.RIFLES]: 'Rifles',
  [SKIN_CATEGORIES.SMG]: 'SMG',
  [SKIN_CATEGORIES.HEAVY]: 'Heavy',
} as const;

// Frontend to backend category mapping
export const FrontendToBackendSkinCategoryMap: Record<string, number> = {
  knives: SKIN_CATEGORIES.KNIVES,
  gloves: SKIN_CATEGORIES.GLOVES,
  pistols: SKIN_CATEGORIES.PISTOLS,
  rifles: SKIN_CATEGORIES.RIFLES,
  smg: SKIN_CATEGORIES.SMG,
  heavy: SKIN_CATEGORIES.HEAVY,
};

// Common weapon types
export const WEAPON_TYPES = {
  // Knives
  BUTTERFLY_KNIFE: 'Butterfly Knife',
  KARAMBIT: 'Karambit',
  BAYONET: 'Bayonet',
  M9_BAYONET: 'M9 Bayonet',
  
  // Pistols
  GLOCK_18: 'Glock-18',
  USP_S: 'USP-S',
  DESERT_EAGLE: 'Desert Eagle',
  P250: 'P250',
  CZ75: 'CZ75-Auto',
  
  // Rifles
  AK_47: 'AK-47',
  M4A4: 'M4A4',
  M4A1_S: 'M4A1-S',
  AWP: 'AWP',
  AUG: 'AUG',
  SG_553: 'SG 553',
  
  // SMG
  MP7: 'MP7',
  MP9: 'MP9',
  P90: 'P90',
  UMP_45: 'UMP-45',
  
  // Heavy
  M249: 'M249',
  NEGEV: 'Negev',
} as const;

// Skin condition types
export const SKIN_CONDITIONS = {
  FACTORY_NEW: 'Factory New',
  MINIMAL_WEAR: 'Minimal Wear',
  FIELD_TESTED: 'Field-Tested',
  WELL_WORN: 'Well-Worn',
  BATTLE_SCARRED: 'Battle-Scarred',
} as const;

export const SkinsTypeMapNames = {
  [SKIN_CATEGORIES.KNIVES]: 'Knives',
  [SKIN_CATEGORIES.GLOVES]: 'Gloves',
  [SKIN_CATEGORIES.PISTOLS]: 'Pistols',
  [SKIN_CATEGORIES.RIFLES]: 'Rifles',
  [SKIN_CATEGORIES.SMG]: 'SMG',
  [SKIN_CATEGORIES.HEAVY]: 'Heavy',
} as const;

export interface Skin {
  category_id: number;
  created_at: string;
  full_name: string;
  id: number;
  image_file: string;
  link: string;
  name: string;
  skin_name: string;
  weapon: string;
}

// Export types from skins-api
export type { 
  SkinRead, 
  SkinCategoryRead, 
  SkinCreate, 
  SkinUpdate,
  PaginatedSkinsResponse,
  PaginatedSkinCategoriesResponse,
  GetSkinsParams,
  GetSkinCategoriesParams,
} from '@/lib/skins-api';
  
  