from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime, timezone


class BaseAttrsModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(BigInteger, ForeignKey("product.id", ondelete="CASCADE"), unique=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    brand = Column(String)
    model = Column(String)


class CPUAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="cpu_attributes")

    cores = Column(Integer)
    threads = Column(Integer)
    socket_type = Column(String)
    base_speed = Column(Float)  # float 
    turbo_speed = Column(Float)  # float
    architechture = Column(String)
    core_family = Column(String)
    integrated_graphics = Column(String, nullable=True)
    memory_type = Column(String)
    memory_speed = Column(Integer)
    series = Column(String)
    generation = Column(String)


class CPUCoolerAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="cpu_cooler_attributes")

    fan_rpm_base = Column(Integer)
    fan_rpm_max = Column(Integer)
    noise_level_base = Column(Float)
    noise_level_max = Column(Float)
    color = Column(String)


class MotherboardAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="motherboard_attributes")

    chipset = Column(String)
    form_factor = Column(String)
    socket_type = Column(String)
    ram_slots = Column(Integer)
    max_ram_support = Column(Integer)


class RAMAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="ram_attributes")

    total_memory = Column(Integer)
    one_unit_memory = Column(Integer)
    quantity = Column(Integer)
    ram_type = Column(String)
    ram_speed = Column(Integer)
    cas_latency = Column(String)

class StorageAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="storage_attributes")

    capacity = Column(Integer)
    mem_type = Column(String)
    interface = Column(String)
    cache_mem = Column(Integer)
    form_factor = Column(String)


class GPUAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="gpu_attributes")

    memory = Column(Float)
    mem_interface = Column(String)
    length = Column(Integer)
    interface = Column(String)
    chipset = Column(String)
    base_clock = Column(Integer)
    clock_speed = Column(Integer)
    frame_sync = Column(String)


class PowerSupplyAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="power_supply_attributes")

    power = Column(Integer)
    efficiency = Column(String)
    color = Column(String)


class CaseAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="case_attributes")

    side_panel = Column(String)
    cabinet_type = Column(String)
    color = Column(String)

class MouseAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="mouse_attributes")

    color = Column(String)
    connectivity_technology = Column(String)
    special_feature = Column(String)
    movement_detection_technology = Column(String)
    number_of_buttons = Column(Integer)

class MonitorAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="monitor_attributes")

    screen_size = Column(Float)
    resolution = Column(String)
    aspect_ratio = Column(String)
    screen_surface_description = Column(String)
    style = Column(String)

class KeyboardAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="keyboard_attributes")

    pattern = Column(String)
    compatible_devices = Column(String)
    connectivity_technology = Column(String)
    keyboard_description = Column(String)
    recommended_uses_for_product = Column(String)
    special_feature = Column(String)
    number_of_keys = Column(Integer)
    keyboard_backlighting_color_support = Column(String)
    color = Column(String)
    size = Column(String)
    style = Column(String)

class HeadsetAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="headset_attributes")

    color = Column(String)
    par_placement = Column(String)
    form_factor = Column(String)
    impedance = Column(Integer)
    size = Column(String)

class MousepadAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="mousepad_attributes")

    color = Column(String)
    special_feature = Column(String)
    recommended_uses_for_product = Column(String)
    material = Column(String)
    size = Column(String)
    style = Column(String)

class ChairAttributes(BaseAttrsModel):
    product = relationship("Product", back_populates="chair_attributes")

    color = Column(String)
    product_dimensions = Column(String)
    size = Column(String)
    back_style = Column(String)
