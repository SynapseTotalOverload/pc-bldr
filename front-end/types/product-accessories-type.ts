export interface CategoryRead {
    id: number;
    keepa_id: number;
    name: string;
  }
  
  export interface ProductBase {
    asin: string;
    title: string;
    price?: number;
    rating?: number;
    created_at: string; // ISO string from `datetime`
  }
  
  export interface ProductCreate extends ProductBase {
    category_id?: number;
  }
  
  
  
  export interface ProductUpdate {
    title?: string;
    price?: number;
    rating?: number;
    category_id?: number;
  }
  
  export interface ProductTypeMap {
    mouse: Mouse;
    monitor: Monitor;
    keyboard: Keyboard;
    headset: Headset;
    mousepad: Mousepad;
    chair: Chair;
  }
  export interface ProductTypeMapNamesAccessories {
    mouse: 'Mouse';
    monitor: 'Monitor';
    keyboard: 'Keyboard';
    headset: 'Headset';
    mousepad: 'Mousepad';
    chair: 'Chair';
    microphone: 'Microphone';
    camera: 'Camera';
    headphones: 'Headphones';
  }
  
  export const PRODUCT_TYPE_NAMES: Record<keyof ProductTypeMapNamesAccessories, string> = {
    mouse: 'Mouse',
    monitor: 'Monitor',
    keyboard: 'Keyboard',
    headset: 'Headset',
    mousepad: 'Mousepad',
    chair: 'Chair',
    microphone: 'Microphone',
    camera: 'Camera',
    headphones: 'Headphones',
  };
  
  export interface ProductTypeMapIds {
    MOUSE: 9;
    MONITOR: 10;
    KEYBOARD: 11;
    HEADSET: 12;
    MOUSEPAD: 13;
    CHAIR: 14;
    MICROPHONE: 15;
    CAMERA: 16;
    HEADPHONES: 17;
  }
  export const ProductConstantMapIdsAccessories: Record<keyof ProductTypeMapIds, number> = {
    MOUSE: 9,
    MONITOR: 10,
    KEYBOARD: 11,
    HEADSET: 12,
    MOUSEPAD: 13,
    CHAIR: 14,
    MICROPHONE: 15,
    CAMERA: 16,
    HEADPHONES: 17,
  }
  
  export const FrontendToBackendCategoryMapAccessories: Record<string, keyof ProductTypeMapIds> = {
    mouse: 'MOUSE',
    monitor: 'MONITOR',
    keyboard: 'KEYBOARD',
    headset: 'HEADSET',
    mousepad: 'MOUSEPAD',
    chair: 'CHAIR',
    microphone: 'MICROPHONE',
    camera: 'CAMERA',
    headphones: 'HEADPHONES',
  };
  
  export const FrontendToBackendCategoryIdMapAccessories: Record<string, keyof ProductTypeMapIds> = {
    9: 'MOUSE',
    10: 'MONITOR',
    11: 'KEYBOARD',
    12: 'HEADSET',
    13: 'MOUSEPAD',
    14: 'CHAIR',
    15: 'MICROPHONE',
    16: 'CAMERA',
    17: 'HEADPHONES',
  }
  
  export interface PaginatedInterface<T> {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  export interface ProductRead extends ProductBase {
    id: number;
    created_at: string; // ISO string from `datetime`
    category?: CategoryRead;
    attrs: ProductAttrs;
    display_name?: string;
    low_image_url?: string;
    high_image_url?: string;
  }
  export interface ProductGenericRead<T extends ProductAttrs> extends ProductBase {
    id: number;
    created_at: string; // ISO string from `datetime`
    category?: CategoryRead;
    attrs: T;
    display_name?: string;
    low_image_url?: string;
    high_image_url?: string;
  }
  export interface BuildRead{
    name: string;
    build_type: string;
    build_price: number;
    mouse: ProductGenericRead<Mouse>;
    monitor: ProductGenericRead<Monitor>;
    keyboard: ProductGenericRead<Keyboard>;
    headset: ProductGenericRead<Headset>;
    mousepad: ProductGenericRead<Mousepad>;
    chair: ProductGenericRead<Chair>;
    microphone: ProductGenericRead<Microphone>;
    camera: ProductGenericRead<Camera>;
    headphones: ProductGenericRead<Headphones>;
    id: number;
    created_at: string; // ISO string from `datetime`
    updated_at: string; // ISO string from `datetime`
    show_in_site: boolean;
  }
  
  
  export type ProductAttrs = Mouse | Monitor | Keyboard | Headset | Mousepad | Chair | Microphone | Camera | Headphones;
  
  export interface BaseAttrs {
    brand: string;
    model: string;
  }
  export type Mouse = AttributeWithLabel<MouseAttributes>;
  export type Monitor = AttributeWithLabel<MonitorAttributes>;
  export type Keyboard = AttributeWithLabel<KeyboardAttributes>;
  export type Headset = AttributeWithLabel<HeadsetAttributes>;
  export type Mousepad = AttributeWithLabel<MousepadAttributes>;
  export type Chair = AttributeWithLabel<ChairAttributes>;
  export type Microphone = AttributeWithLabel<MicrophoneAttributes>;
  export type Camera = AttributeWithLabel<CameraAttributes>;
  export type Headphones = AttributeWithLabel<HeadphonesAttributes>;
  
  export type AttributeWithLabel<T extends { type: string }> = BaseAttrs & T;

  export interface MouseAttributes {
    type: 'mouse';
    brand: string;
    color: string;
    connectivity_technology: string;
    special_feature: string;
    movement_detection_technology: string;
    number_of_buttons: number;
  }

  export interface MonitorAttributes {
    type: 'monitor';
    brand: string;
    screen_size: number;
    resolution: string;
    aspect_ratio: string;
    screen_surface_description: string;
    style: string;
  }

  export interface KeyboardAttributes {
    type: 'keyboard';
    brand: string;
    color: string;
    pattern: string;
    compatible_devices: string;
    connectivity_technology: string;
    keyboard_description: string;
    recommended_uses_for_product: string;
    special_feature: string;
    number_of_keys: number;
    keyboard_backlighting_color_support: string;
    size: string;
    style: string;
  }

  export interface HeadsetAttributes {
    type: 'headset';
    brand: string;
    color: string;
    par_placement: string;
    form_factor: string;
    impedance: number;
    size: string;
  }

  export interface MousepadAttributes {
    type: 'mousepad';
    brand: string;
    color: string;
    special_feature: string;
    recommended_uses_for_product: string;
    material: string;
    size: string;
    style: string;
  }

  export interface ChairAttributes {
    type: 'chair';
    brand: string;
    color: string;
    product_dimensions: string;
    size: string;
    back_style: string;
  }

  export interface MicrophoneAttributes {
    type: 'microphone';
    brand: string;
    color: string;
    recommended_uses_for_product: string;
    connectivity_technology: string;
    connector_type: string;
    special_feature: string;
    compatible_devices: string;
    included_components: string;
    polar_pattern: string;

  }

  export interface CameraAttributes {
    type: 'camera';
    brand: string;
    model: string;
    photo_sensor_technology: string;
    video_capture_resolution: number;
    maximum_aperture: number;
    flash_memory_type: string;
    supported_audio_format: string;
    screen_size: number;
    connectivity_technology: string;
    color: string;
  }

  export interface HeadphonesAttributes {
    type: 'headphones';
    brand: string;
    model: string;
    color: string;
    impedance: number;
    form_factor: string;
    ear_placement: string;
  }

  
  
  
  
  