'use client';

import { use, useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Power, 
  Fan,
  ArrowLeft,
  Database,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { PRODUCT_TYPE_NAMES } from '@/types/prodcuts-base';
import { useFile } from '@/hooks/useFile';
import { useRef } from 'react';
import Diagram from '@/components/diagram/diagram';
import { useProductGraphsById } from '@/hooks/graphs/useProductGraphsById';
import { ProductUsageGraphResponse } from '@/types/product-graph';

const categoryIcons = {
  cpu: Cpu,
  cpu_cooler: Fan,
  gpu: Monitor,
  memory: Database,
  motherboard: Box,
  internal_hard_drive: HardDrive,
  power_supply: Power,
  video_card: Monitor,
  case: Box,
};

const formatPrice = (price?: number) => {
  if (!price) return 'Price not available';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const formatRating = (rating?: number) => {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const renderCPUAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.cores && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cores</span>
          <span className="font-medium">{attrs.cores}</span>
        </div>
      )}
      {attrs.threads && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Threads</span>
          <span className="font-medium">{attrs.threads}</span>
        </div>
      )}
      {attrs.socket_type && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Socket Type</span>
          <span className="font-medium">{attrs.socket_type}</span>
        </div>
      )}
      {attrs.base_speed && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Speed</span>
          <span className="font-medium">{attrs.base_speed} GHz</span>
        </div>
      )}
      {attrs.turbo_speed && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Turbo Speed</span>
          <span className="font-medium">{attrs.turbo_speed} GHz</span>
        </div>
      )}
    </div>
    <div className="space-y-3">
      {(attrs.architechture || attrs.architecture) && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Architecture</span>
          <span className="font-medium">{attrs.architechture || attrs.architecture}</span>
        </div>
      )}
      {attrs.core_family && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Core Family</span>
          <span className="font-medium">{attrs.core_family}</span>
        </div>
      )}
      {attrs.memory_type && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Memory Type</span>
          <span className="font-medium">{attrs.memory_type}</span>
        </div>
      )}
      {attrs.memory_speed && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Memory Speed</span>
          <span className="font-medium">{attrs.memory_speed} MHz</span>
        </div>
      )}
      {attrs.integrated_graphics && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Integrated Graphics</span>
          <span className="font-medium">{attrs.integrated_graphics}</span>
        </div>
      )}
      {attrs.generation && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Generation</span>
          <span className="font-medium">{attrs.generation}</span>
        </div>
      )}
      {attrs.series && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Series</span>
          <span className="font-medium">{attrs.series}</span>
        </div>
      )}
    </div>
  </div>
);

const renderGPUAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory</span>
        <span className="font-medium">{attrs.memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Interface</span>
        <span className="font-medium">{attrs.mem_interface}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Interface</span>
        <span className="font-medium">{attrs.interface}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Chipset</span>
        <span className="font-medium">{attrs.chipset}</span>
      </div>
      {attrs.length && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Length</span>
          <span className="font-medium">{attrs.length} mm</span>
        </div>
      )}
    </div>
    <div className="space-y-3">
      {attrs.base_clock && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Clock</span>
          <span className="font-medium">{attrs.base_clock} MHz</span>
        </div>
      )}
      {attrs.clock_speed && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Clock Speed</span>
          <span className="font-medium">{attrs.clock_speed} MHz</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Frame Sync</span>
        <span className="font-medium">{attrs.frame_sync}</span>
      </div>
    </div>
  </div>
);

const renderRAMAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Total Memory</span>
        <span className="font-medium">{attrs.total_memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Unit Memory</span>
        <span className="font-medium">{attrs.one_unit_memory} GB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Quantity</span>
        <span className="font-medium">{attrs.quantity}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Type</span>
        <span className="font-medium">{attrs.ram_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Speed</span>
        <span className="font-medium">{attrs.ram_speed} MHz</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">CAS Latency</span>
        <span className="font-medium">{attrs.cas_latency}</span>
      </div>
    </div>
  </div>
);

const renderStorageAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.capacity && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capacity</span>
          <span className="font-medium">{attrs.capacity} GB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Memory Type</span>
        <span className="font-medium">{attrs.mem_type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Interface</span>
        <span className="font-medium">{attrs.interface}</span>
      </div>
    </div>
    <div className="space-y-3">
      {attrs.cache_mem && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cache Memory</span>
          <span className="font-medium">{attrs.cache_mem} MB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
    </div>
  </div>
);

const renderMotherboardAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Chipset</span>
        <span className="font-medium">{attrs.chipset}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Socket Type</span>
        <span className="font-medium">{attrs.socket_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">RAM Slots</span>
        <span className="font-medium">{attrs.ram_slots}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Max RAM Support</span>
        <span className="font-medium">{attrs.max_ram_support} GB</span>
      </div>
    </div>
  </div>
);

const renderPowerSupplyAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.power && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Power</span>
          <span className="font-medium">{attrs.power} W</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Efficiency</span>
        <span className="font-medium">{attrs.efficiency}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderCPUCoolerAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      {attrs.fan_rpm_base && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Fan RPM</span>
          <span className="font-medium">{attrs.fan_rpm_base}</span>
        </div>
      )}
      {attrs.fan_rpm_max && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Max Fan RPM</span>
          <span className="font-medium">{attrs.fan_rpm_max}</span>
        </div>
      )}
    </div>
    <div className="space-y-3">
      {attrs.noise_level_base && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Noise Level</span>
          <span className="font-medium">{attrs.noise_level_base} dB</span>
        </div>
      )}
      {attrs.noise_level_max && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Max Noise Level</span>
          <span className="font-medium">{attrs.noise_level_max} dB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderCaseAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Side Panel</span>
        <span className="font-medium">{attrs.side_panel}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cabinet Type</span>
        <span className="font-medium">{attrs.cabinet_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderMouseAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Number of Buttons</span>
        <span className="font-medium">{attrs.number_of_buttons}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Special Feature</span>
        <span className="font-medium">{attrs.special_feature}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Movement Detection Technology</span>
        <span className="font-medium">{attrs.movement_detection_technology}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Connectivity Technology</span>
        <span className="font-medium">{attrs.connectivity_technology}</span>
      </div>
    </div>
  </div>
);

const renderMonitorAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Screen Size</span>
        <span className="font-medium">{attrs.screen_size} inches</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Resolution</span>
        <span className="font-medium">{attrs.resolution}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Aspect Ratio</span>
        <span className="font-medium">{attrs.aspect_ratio}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Screen Surface Description</span>
        <span className="font-medium">{attrs.screen_surface_description}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Style</span>
        <span className="font-medium">{attrs.style}</span>
      </div>
    </div>
  </div>
);

const renderKeyboardAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Patern</span>
        <span className="font-medium">{attrs.patern}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Compatible Devices</span>
        <span className="font-medium">{attrs.compatible_devices}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Connectivity Technology</span>
        <span className="font-medium">{attrs.connectivity_technology}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Keyboard Description</span>
        <span className="font-medium">{attrs.keyboard_description}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Recommended Uss For Product</span>
        <span className="font-medium">{attrs.recommended_use_for_product}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Special Feature</span>
        <span className="font-medium">{attrs.special_feature}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Number of Keys</span>
        <span className="font-medium">{attrs.number_of_keys}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Keyboard Backlight</span>
        <span className="font-medium">{attrs.keyboard_backlight}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Size</span>
        <span className="font-medium">{attrs.size}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Style</span>
        <span className="font-medium">{attrs.style}</span>
      </div>
    </div>
  </div>
);

const renderHeadsetAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Ear Placement</span>
        <span className="font-medium">{attrs.par_placement}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Impedance</span>
        <span className="font-medium">{attrs.impedance}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Size</span>
        <span className="font-medium">{attrs.size}</span>
      </div>
    </div>
  </div>
);

const renderMousepadAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Special Feature</span>
        <span className="font-medium">{attrs.special_feature}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Recommended Uses For Product</span>
        <span className="font-medium">{attrs.recommended_uses_for_product}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Material</span>
        <span className="font-medium">{attrs.material}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Size</span>
        <span className="font-medium">{attrs.size}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Style</span>
        <span className="font-medium">{attrs.style}</span>
      </div>
    </div>
  </div>
);

const renderChairAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Product Description</span>
        <span className="font-medium">{attrs.product_dimensions}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Back Style</span>
        <span className="font-medium">{attrs.back_style}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Size</span>
        <span className="font-medium">{attrs.size}</span>
      </div>
    </div>
  </div>
);

const renderMicrophoneAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Connectivity Technology</span>
        <span className="font-medium">{attrs.connectivity_technology}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Connector Type</span>
        <span className="font-medium">{attrs.connector_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Special Feature</span>
        <span className="font-medium">{attrs.special_feature}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Compatible Devices</span>
        <span className="font-medium">{attrs.compatible_devices}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Included Components</span>
        <span className="font-medium">{attrs.included_components}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Polar Pattern</span>
        <span className="font-medium">{attrs.polar_pattern}</span>
      </div>
    </div>
    
    
  </div>
);

const renderCameraAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Photo Sensor Technology</span>
        <span className="font-medium">{attrs.photo_sensor_technology}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Video Capture Resolution</span>
        <span className="font-medium">{attrs.video_capture_resolution}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Maximum Aperture</span>
        <span className="font-medium">{attrs.maximum_aperture}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Flash Memory Type</span>
        <span className="font-medium">{attrs.flash_memory_type}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Supported Audio Format</span>
        <span className="font-medium">{attrs.supported_audio_format}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Screen Size</span>
        <span className="font-medium">{attrs.screen_size}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Connectivity Technology</span>
        <span className="font-medium">{attrs.connectivity_technology}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
  </div>
);

const renderHeadphonesAttributes = (attrs: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Color</span>
        <span className="font-medium">{attrs.color}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Impedance</span>
        <span className="font-medium">{attrs.impedance}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Form Factor</span>
        <span className="font-medium">{attrs.form_factor}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Ear Placement</span>
        <span className="font-medium">{attrs.ear_placement}</span>
      </div>
    </div>
  </div>
)

const renderAttributes = (attrs: any, name: string) => { 
  if (!attrs || !name) {
    return (
      <div className="text-muted-foreground">
        <p>No attributes available for this product.</p>
        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
          {JSON.stringify(attrs, null, 2)}
        </pre>
      </div>
    );
  }

  console.log(name)
  switch (name) {
    case 'CPU':
      return renderCPUAttributes(attrs);
    case 'GPU':
      return renderGPUAttributes(attrs);
    case 'RAM':
      return renderRAMAttributes(attrs);
    case 'ROM':
      return renderStorageAttributes(attrs);
    case 'Motherboard':
      return renderMotherboardAttributes(attrs);
    case 'Power Supply':
      return renderPowerSupplyAttributes(attrs);
    case 'CPU Cooler':
      return renderCPUCoolerAttributes(attrs);
    case 'Case':
      return renderCaseAttributes(attrs);
    case 'Mouse':
      return renderMouseAttributes(attrs);
    case 'Monitor':
      return renderMonitorAttributes(attrs);
    case 'Keyboard':
      return renderKeyboardAttributes(attrs);
    case 'Headset':
      return renderHeadsetAttributes(attrs);
    case 'Mousepad':
      return renderMousepadAttributes(attrs);
    case 'Chair':
      return renderChairAttributes(attrs);
    case 'Microphone':
      return renderMicrophoneAttributes(attrs);
    case 'Camera':
      return renderCameraAttributes(attrs);
    case 'Headphones':
      return renderHeadphonesAttributes(attrs);
    default:
      return (
        <div className="text-muted-foreground">
          <p>Unknown attribute type: {attrs.type}</p>
          <pre className="whitespace-pre-wrap text-xs mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(attrs, null, 2)}</pre>
        </div>
      );
  }
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(id);

  // fetch product image from S3
  const { imageUrl, fetch: fetchImg, loading: loadingImg } = useFile();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('2025-07-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);   
  const router = useRouter()
  const { data, loading: loadingGraph, error: errorGraph, refetch } = useProductGraphsById<ProductUsageGraphResponse>({
    start_date: startDate,
    end_date: endDate,
    product_id: Number(id)
  });

  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!product?.high_image_url) return;

    const url = product.high_image_url;
    if (url.includes('https://pcbuilder')) {
      fetchImg({ url });
    } else {
      setImgSrc(url);
    }
  }, [product?.high_image_url]);

  // Update imgSrc when S3 blob loaded
  useEffect(() => {
    if (imageUrl) setImgSrc(imageUrl);
  }, [imageUrl]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert>
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[product.category?.name as keyof typeof categoryIcons] || Cpu;
  const categoryName = PRODUCT_TYPE_NAMES[product.category?.name as keyof typeof PRODUCT_TYPE_NAMES] || product.category?.name || 'Unknown';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary">{categoryName}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {formatRating(product.rating)}
                    <span className="text-sm text-muted-foreground">ASIN: {product.asin}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Brand & Model */}
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{product.attrs?.brand || 'N/A'}</span>
                    </div>
                    {product.category?.id && product.category.id >= 1 && product.category.id <= 8 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{product.attrs?.model || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Technical Specifications */}
                <div>
                  <h4 className="font-semibold mb-3">Technical Specifications</h4>
                  {product.attrs ? renderAttributes(product.attrs, product.category?.name || '') : (
                    <div className="text-muted-foreground">
                      <p>No technical specifications available for this product.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Usage Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <Diagram 
                data={data}
                onStartDateChange={(date) => setStartDate(date)}
                onEndDateChange={(date) => setEndDate(date)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardHeader className="items-center justify-center">
              {loadingImg && !imgSrc && <Skeleton className="w-64 h-64 rounded-md" />}
              {imgSrc && (
                <img src={imgSrc} alt={product.title} className="w-64 h-64 object-cover rounded-md" />
              )}
            </CardHeader>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ASIN</span>
                  <span className="font-medium font-mono text-sm">{product.asin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added</span>
                  <span className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amazon Link */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <a 
                  href={`https://amazon.com/dp/${product.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Amazon
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
