from sqlalchemy import and_
from app.models import (
    CPUAttributes,
    CPUCoolerAttributes,
    MotherboardAttributes,
    RAMAttributes,
    StorageAttributes,
    GPUAttributes,
    PowerSupplyAttributes,
    CaseAttributes,
    Product
)


class ComponentFiltersBuilder:
    @classmethod
    def form_cpu_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        motherboard = selected_components.get("motherboard")
        if motherboard:
            filters.append(CPUAttributes.socket_type == motherboard.motherboard_attributes.socket_type)
        ram = selected_components.get("ram")
        if ram:
            filters.append(CPUAttributes.memory_type == ram.ram_attributes.ram_type)
            filters.append(CPUAttributes.memory_speed <= ram.ram_attributes.ram_speed)
        return filters

    @classmethod
    def form_cpu_cooler_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        case = selected_components.get("case")
        if case:
            # TODO: add cooler height check
            pass
        return filters

    @classmethod
    def form_motherboard_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        cpu = selected_components.get("cpu")
        if cpu:
            filters.append(MotherboardAttributes.socket_type == cpu.cpu_attributes.socket_type)
        ram = selected_components.get("ram")
        if ram:
            # TODO: the same with form_ram_compability_filters
            filters.append(MotherboardAttributes.max_ram_support >= ram.ram_attributes.total_memory)
            filters.append(MotherboardAttributes.ram_slots >= ram.ram_attributes.quantity)
        return filters

    @classmethod
    def form_ram_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        motherboard = selected_components.get("motherboard")
        if motherboard:
            # TODO: add to mb model ram type and max ram speed attrs
            filters.append(RAMAttributes.total_memory <= motherboard.motherboard_attributes.max_ram_support)
            filters.append(RAMAttributes.quantity <= motherboard.motherboard_attributes.ram_slots)
        cpu = selected_components.get("cpu")
        if cpu:
            filters.append(RAMAttributes.ram_type == cpu.cpu_attributes.memory_type)
            filters.append(RAMAttributes.ram_speed <= cpu.cpu_attributes.memory_speed)
        return filters

    @classmethod
    def form_storage_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        motherboard = selected_components.get("motherboard")
        if motherboard:
            # TODO: add to mb model rom slots info, case model slots count and filter by it
            pass
        return filters

    @classmethod
    def form_gpu_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []
        case = selected_components.get("case")
        motherboard = selected_components.get("motherboard")
        if motherboard or case:
            max_length = min(
                cls._get_case_gpu_length_limit(case.case_attributes.cabinet_type if case else None),
                cls._get_mb_gpu_length_limit(motherboard.motherboard_attributes.form_factor if motherboard else None)
            )
            filters.append(GPUAttributes.length < max_length)
        psu = selected_components.get("psu")
        if psu:
            # TODO: add minimum required power attr to gpu and use there
            pass
        return filters

    @classmethod
    def form_power_supply_compability_filters(cls, selected_components: dict[str,Product], budget: int) -> list:
        """TODO: add to cpu,  gpu and other power draw and use it to estimate psu power"""
        filters = []
        estimated_pd = cls._estimate_power_draw(budget=budget)
        filters.append(PowerSupplyAttributes.power >= estimated_pd)
        return filters

    @classmethod
    def form_case_compability_filters(cls, selected_components: dict[str,Product]) -> list:
        filters = []

        motherboard = selected_components.get("motherboard")
        gpu = selected_components.get("gpu")
        cpu_cooler = selected_components.get("cpu_cooler")
        if motherboard or gpu:
            available_cab_types = cls._get_minimum_compatible_case(
                motherboard.motherboard_attributes.form_factor if
                motherboard else None, 
                gpu.gpu_attributes.length if
                gpu else None, 
            )
            filters.append(CaseAttributes.cabinet_type.in_(available_cab_types))
        if cpu_cooler:
            # TODO: Max cooler height limit filter
            pass
        return filters
    
    # support funcs goes here
    @classmethod
    def _get_minimum_compatible_case(cls, motherboard_form_factor: str | None, gpu_length: int | None) -> list[str]:
        """TODO: add to cases model max gpu length, max cooler height, mb form factor support and remove it"""
        all_cases = [
            "Mini ITX",
            "MicroATX Mini Tower",
            "MicroATX Mid Tower",
            "ATX Mini Tower",
            "ATX Mid Tower",
            "ATX Full Tower",
        ]

        mb_compat_map = {
            "Extended ATX": {"ATX Full Tower"},
            "ATX": {"ATX Mid Tower", "ATX Full Tower", "ATX Mini Tower"},
            "Micro ATX": {
                "MicroATX Mini Tower",
                "MicroATX Mid Tower",
                "ATX Mini Tower",
                "ATX Mid Tower",
                "ATX Full Tower",
            },
            "Mini ITX": set(all_cases),
        }

        allowed_by_mb = mb_compat_map.get(motherboard_form_factor, set(all_cases)) if motherboard_form_factor else set(all_cases)

        if gpu_length is not None:
            if gpu_length > 400:
                raise Exception(f"No available cases for GPU length {gpu_length}")
            elif gpu_length > 340:
                allowed_by_gpu = set(all_cases[5:])  # ATX Full Tower
            elif gpu_length > 300:
                allowed_by_gpu = set(all_cases[4:])  # ATX Mid Tower+
            elif gpu_length > 280:
                allowed_by_gpu = set(all_cases[2:])  # MicroATX Mid Tower+
            elif gpu_length > 260:
                allowed_by_gpu = set(all_cases[1:])  # MicroATX Mini Tower+
            else:
                allowed_by_gpu = set(all_cases)
        else:
            allowed_by_gpu = set(all_cases)

        return allowed_by_mb & allowed_by_gpu

    @classmethod
    def _estimate_power_draw(cls, budget: int) -> int:
        """TODO: add to gpu, cpu and othe(if need) components power draw and estimate needed psu power with this data"""
        if budget < 500:
            return 0
        elif budget < 800:
            return 650
        elif budget < 1200:
            return 850
        elif budget < 1600:
            return 1050
        else:
            return 1400

    @classmethod
    def _get_case_gpu_length_limit(cls, cabinet_type: str) -> int:
        """Mocked average GPU fit limit by case type."""
        limits = {
            "Mini ITX": 260,
            "MicroATX Mini Tower": 280,
            "MicroATX Mid Tower": 300,
            "ATX Mini Tower": 300,
            "ATX Mid Tower": 340,
            "ATX Full Tower": 400,
        }
        return limits.get(cabinet_type, 1000)

    @classmethod
    def _get_mb_gpu_length_limit(cls, motherboard_form_factor: str) -> int:
        """Mocked average GPU length support based on motherboard form factor."""
        limits = {
            "Extended ATX": 400,
            "ATX": 360,
            "Micro ATX": 320,
            "Mini ITX": 270,
        }
        return limits.get(motherboard_form_factor, 1000)
