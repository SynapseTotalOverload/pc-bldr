from typing import Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class BaseAttrsSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True, extra="forbid")

    brand: Optional[str] = None
    model: Optional[str] = None


class CPUAttributesUpdateSchema(BaseAttrsSchema):
    cores: Optional[int] = None
    threads: Optional[int] = None
    socket_type: Optional[str] = None
    base_speed: Optional[float] = None
    turbo_speed: Optional[float] = None
    architechture: Optional[str] = None
    core_family: Optional[str] = None
    integrated_graphics: Optional[str] = None
    memory_type: Optional[str] = None
    memory_speed: Optional[int] = None
    series: Optional[str] = None
    generation: Optional[str] = None


class CPUCoolerAttributesUpdateSchema(BaseAttrsSchema):
    fan_rpm_base: Optional[int] = None
    fan_rpm_max: Optional[int] = None
    noise_level_base: Optional[float] = None
    noise_level_max: Optional[float] = None
    color: Optional[str] = None


class MotherboardAttributesUpdateSchema(BaseAttrsSchema):
    chipset: Optional[str] = None
    form_factor: Optional[str] = None
    socket_type: Optional[str] = None
    ram_slots: Optional[int] = None
    max_ram_support: Optional[int] = None


class RAMAttributesUpdateSchema(BaseAttrsSchema):
    total_memory: Optional[int] = None
    one_unit_memory: Optional[int] = None
    quantity: Optional[int] = None
    ram_type: Optional[str] = None
    ram_speed: Optional[int] = None
    cas_latency: Optional[str] = None


class StorageAttributesUpdateSchema(BaseAttrsSchema):
    capacity: Optional[int] = None
    mem_type: Optional[str] = None
    interface: Optional[str] = None
    cache_mem: Optional[int] = None
    form_factor: Optional[str] = None


class GPUAttributesUpdateSchema(BaseAttrsSchema):
    memory: Optional[float] = None
    mem_interface: Optional[str] = None
    length: Optional[int] = None
    interface: Optional[str] = None
    chipset: Optional[str] = None
    base_clock: Optional[int] = None
    clock_speed: Optional[int] = None
    frame_sync: Optional[str] = None


class PowerSupplyAttributesUpdateSchema(BaseAttrsSchema):
    power: Optional[int] = None
    efficiency: Optional[str] = None
    color: Optional[str] = None


class CaseAttributesUpdateSchema(BaseAttrsSchema):
    side_panel: Optional[str] = None
    cabinet_type: Optional[str] = None
    color: Optional[str] = None


class MouseAttributesUpdateSchema(BaseAttrsSchema):
    color: Optional[str] = None
    connectivity_technology: Optional[str] = None
    special_feature: Optional[str] = None
    movement_detection_technology: Optional[str] = None
    number_of_buttons: Optional[int] = None


class MonitorAttributesUpdateSchema(BaseAttrsSchema):
    screen_size: Optional[float] = None
    resolution: Optional[str] = None
    aspect_ratio: Optional[str] = None
    screen_surface_description: Optional[str] = None
    style: Optional[str] = None


class KeyboardAttributesUpdateSchema(BaseAttrsSchema):
    pattern: Optional[str] = None
    compatible_devices: Optional[str] = None
    connectivity_technology: Optional[str] = None
    keyboard_description: Optional[str] = None
    recommended_uses_for_product: Optional[str] = None
    special_feature: Optional[str] = None
    number_of_keys: Optional[int] = None
    keyboard_backlighting_color_support: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
    style: Optional[str] = None


class HeadsetAttributesUpdateSchema(BaseAttrsSchema):
    color: Optional[str] = None
    par_placement: Optional[str] = None
    form_factor: Optional[str] = None
    impedance: Optional[int] = None
    size: Optional[str] = None


class MousepadAttributesUpdateSchema(BaseAttrsSchema):
    color: Optional[str] = None
    special_feature: Optional[str] = None
    recommended_uses_for_product: Optional[str] = None
    material: Optional[str] = None
    size: Optional[str] = None
    style: Optional[str] = None


class ChairAttributesUpdateSchema(BaseAttrsSchema):
    color: Optional[str] = None
    product_dimensions: Optional[str] = None
    size: Optional[str] = None
    back_style: Optional[str] = None

class MicrophoneAttributesUpdateSchema(BaseAttrsSchema):
    connectivity_technology: Optional[str] = None
    connector_type: Optional[str] = None
    special_feature: Optional[str] = None
    compatible_devices: Optional[str] = None
    color: Optional[str] = None
    included_components: Optional[str] = None
    polar_pattern: Optional[str] = None

class CameraAttributesUpdateSchema(BaseAttrsSchema):
    photo_sensor_technology: Optional[str] = None
    video_capture_resolution: Optional[int] = None
    maximum_aperture: Optional[float] = None
    flash_memory_type: Optional[str] = None
    video_capture_format: Optional[str] = None
    supported_audio_format: Optional[str] = None
    screen_size: Optional[float] = None
    connectivity_technology: Optional[str] = None
    color: Optional[str] = None

class HeadphonesAttributesUpdateSchema(BaseAttrsSchema):
    color: Optional[str] = None
    ear_placement: Optional[str] = None
    form_factor: Optional[str] = None
    impedance: Optional[int] = None

# Union type for all attribute update schemas
AttributesUpdateUnion = Union[
    CPUAttributesUpdateSchema,
    CPUCoolerAttributesUpdateSchema,
    MotherboardAttributesUpdateSchema,
    RAMAttributesUpdateSchema,
    StorageAttributesUpdateSchema,
    GPUAttributesUpdateSchema,
    PowerSupplyAttributesUpdateSchema,
    CaseAttributesUpdateSchema,
    MouseAttributesUpdateSchema,
    MonitorAttributesUpdateSchema,
    KeyboardAttributesUpdateSchema,
    HeadsetAttributesUpdateSchema,
    MousepadAttributesUpdateSchema,
    ChairAttributesUpdateSchema,
    MicrophoneAttributesUpdateSchema,
    CameraAttributesUpdateSchema,
    HeadphonesAttributesUpdateSchema,
]
