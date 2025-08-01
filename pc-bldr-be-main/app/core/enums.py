from enum import Enum
from app.models.attributes import (
    BaseAttrsModel,
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
    MicrophoneAttributes,
    CameraAttributes,
    HeadphonesAttributes
)


cat_id_to_attrs_model_map: dict[int,type[BaseAttrsModel]] = {
    1: CPUAttributes,
    2: CPUCoolerAttributes,
    3: GPUAttributes,
    4: MotherboardAttributes,
    5: RAMAttributes,
    6: StorageAttributes,
    7: PowerSupplyAttributes,
    8: CaseAttributes,
    9: MouseAttributes,
    10: MonitorAttributes,
    11: KeyboardAttributes,
    12: HeadsetAttributes,
    13: MousepadAttributes,
    14: ChairAttributes,
    15: MicrophoneAttributes,
    16: CameraAttributes,
    17: HeadphonesAttributes,
}

class BuildTypeEnum(Enum):
    GAMING = "gaming"
    OFFICE = "office"
    WORKSTATION = "workstation"
    BUDGET = "budget"
    HIGH_END = "high-end"
    OTHER = "other"