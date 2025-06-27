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
]
