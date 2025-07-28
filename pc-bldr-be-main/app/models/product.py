from typing import TYPE_CHECKING
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, BigInteger, func, text
from sqlalchemy.orm import relationship, Mapped
from app.db.base import Base


if TYPE_CHECKING:
    from app.models import (
        CPUAttributes, 
        CPUCoolerAttributes, 
        GPUAttributes, 
        MotherboardAttributes, 
        RAMAttributes, 
        StorageAttributes, 
        PowerSupplyAttributes, 
        CaseAttributes,
        MouseAttributes,
        MonitorAttributes,
        KeyboardAttributes,
        HeadsetAttributes,
        MousepadAttributes,
        ChairAttributes,
    )


class Product(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    asin = Column(String(12), unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)

    cpu_attributes: Mapped["CPUAttributes"] = relationship("CPUAttributes", back_populates="product", uselist=False)
    cpu_cooler_attributes: Mapped["CPUCoolerAttributes"] = relationship("CPUCoolerAttributes", back_populates="product", uselist=False)
    case_attributes: Mapped["CaseAttributes"] = relationship("CaseAttributes", back_populates="product", uselist=False)
    gpu_attributes: Mapped["GPUAttributes"] = relationship("GPUAttributes", back_populates="product", uselist=False)
    motherboard_attributes: Mapped["MotherboardAttributes"] = relationship("MotherboardAttributes", back_populates="product", uselist=False)
    power_supply_attributes: Mapped["PowerSupplyAttributes"] = relationship("PowerSupplyAttributes", back_populates="product", uselist=False)
    ram_attributes: Mapped["RAMAttributes"] = relationship("RAMAttributes", back_populates="product", uselist=False)
    storage_attributes: Mapped["StorageAttributes"] = relationship("StorageAttributes", back_populates="product", uselist=False)
    mouse_attributes: Mapped["MouseAttributes"] = relationship("MouseAttributes", back_populates="product", uselist=False)
    monitor_attributes: Mapped["MonitorAttributes"] = relationship("MonitorAttributes", back_populates="product", uselist=False)
    keyboard_attributes: Mapped["KeyboardAttributes"] = relationship("KeyboardAttributes", back_populates="product", uselist=False)
    headset_attributes: Mapped["HeadsetAttributes"] = relationship("HeadsetAttributes", back_populates="product", uselist=False)
    mousepad_attributes: Mapped["MousepadAttributes"] = relationship("MousepadAttributes", back_populates="product", uselist=False)
    chair_attributes: Mapped["ChairAttributes"] = relationship("ChairAttributes", back_populates="product", uselist=False)
    low_image_url = Column(String, nullable=True)
    high_image_url = Column(String, nullable=True)
    display_name = Column(String, nullable=True)

    category_id = Column(BigInteger, ForeignKey("category.id", ondelete="SET NULL"))
    category = relationship("Category", back_populates="products")

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False)