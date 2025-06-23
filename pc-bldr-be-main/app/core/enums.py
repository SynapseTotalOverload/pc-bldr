from app.models import (
    BaseAttrsModel,
    CPUAttributes,
    CPUCoolerAttributes,
    GPUAttributes,
    MotherboardAttributes,
    RAMAttributes,
    StorageAttributes,
    PowerSupplyAttributes,
    CaseAttributes
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
}
