"""
Upgraded PC component selection engine with compatibility logic,
scoring system, and rules enforcement.
"""

import logging
from typing import Optional, List
from sqlalchemy import select, and_
from sqlalchemy.orm import Session
from app.models import Product
from app.services.pc_builder.rules import RuleBase
from app.services.pc_builder.enums import COMPONENTS_ENUM, get_budget_distribution
from app.services.pc_builder.component_filters_builder import ComponentFiltersBuilder
from app.models import (
    BaseAttrsModel,
    CPUAttributes,
    CPUCoolerAttributes,
    GPUAttributes,
    MotherboardAttributes,
    RAMAttributes,
    StorageAttributes,
    PowerSupplyAttributes,
    CaseAttributes,
)

logger = logging.getLogger(__name__)

class ComponentSelector:
    """
    Selects the best component of a specific type based on compatibility,
    rule validation, and weighted scoring.
    """

    component_types_to_attr_model_mapping: dict[str, type[BaseAttrsModel]] = {
        "cpu": CPUAttributes,
        "cpu_cooler": CPUCoolerAttributes,
        "gpu": GPUAttributes,
        "motherboard": MotherboardAttributes,
        "ram": RAMAttributes,
        "storage": StorageAttributes,
        "psu": PowerSupplyAttributes,
        "case": CaseAttributes,
    }

    def __init__(
        self,
        budget: float,
        rules: List[RuleBase],
        session: Session,
        component_type: Optional[str] = None,
        selected_components: Optional[dict[str, Product]] = None,
        build_type: Optional[str] = None,
        remaining_budget: Optional[float] = None,
    ):
        """
        :param budget: Total PC budget.
        :param rules: List of rule objects.
        :param session: SQLAlchemy session.
        :param component_type: Target component type to select.
        :param selected_components: Already selected components for compatibility reference.
        :param build_type: Type of build (gaming, office, development) for budget distribution.
        :param remaining_budget: Remaining budget after previous component selections.
        """
        self.budget = budget
        self.rules = rules
        self.session = session
        self.component_type = component_type
        self.selected_components = selected_components or {}
        self.build_type = build_type
        self.remaining_budget = remaining_budget or budget

    @property
    def component_type(self) -> str|None:
        return self._component_type

    @component_type.setter
    def component_type(self, component_type: str) -> None:
        if component_type in COMPONENTS_ENUM or component_type is None:
            self._component_type = component_type
        else:
            raise ValueError("Incorrect component type for component selector")

    def get_component_budget(self) -> float:
        """
        Calculate the budget for the current component based on distribution and remaining budget.
        """
        if not self.build_type or not self.component_type:
            logger.info(f"Component {self.component_type}: Using remaining budget {self.remaining_budget}")
            return self.remaining_budget
        
        distribution = get_budget_distribution(self.build_type)
        component_percentage = distribution.get(self.component_type, 0)
        
        # Calculate base budget for this component
        base_budget = (self.budget * component_percentage) / 100
        
        # If remaining budget is less than base budget, use remaining budget
        # This ensures we don't exceed total budget
        if self.remaining_budget < base_budget:
            logger.info(f"Component {self.component_type}: Using remaining budget {self.remaining_budget} (base: {base_budget})")
            return self.remaining_budget
        
        # If remaining budget is significantly more than base budget,
        # we can use a bit more to get better components
        # but still respect the distribution
        max_additional_budget = base_budget * 0.1  # Allow up to 5% more than base
        available_budget = min(self.remaining_budget, base_budget + max_additional_budget)
        
        logger.info(f"Component {self.component_type}: Budget {available_budget:.2f} (base: {base_budget:.2f}, remaining: {self.remaining_budget:.2f})")
        return available_budget

    def select_best(self) -> Optional[Product]:
        """
        Orchestrates product selection.
        :return: Optimal product or None if not found.
        """
        if not self.component_type:
            raise ValueError("Component type is not set")

        candidates = self._fetch_all_products()
        candidates = self._apply_rules(candidates)

        scored = [(product, self._score(product)) for product in candidates]
        scored.sort(key=lambda tup: tup[1], reverse=True)

        return scored[0][0] if scored else None

    def _fetch_all_products(self) -> List[Product]:
        AttrsModel = self.component_types_to_attr_model_mapping[self.component_type]
        stmt = select(Product).join(AttrsModel)

        filters = []

        # Add budget filter based on component budget
        component_budget = self.get_component_budget()
        if component_budget > 0:
            filters.append(Product.price <= component_budget)

        match self.component_type:
            case "cpu":
                filters.extend(ComponentFiltersBuilder.form_cpu_compability_filters(self.selected_components))
            case "cpu_cooler":
                filters.extend(ComponentFiltersBuilder.form_cpu_cooler_compability_filters(self.selected_components))
            case "gpu":
                filters.extend(ComponentFiltersBuilder.form_gpu_compability_filters(self.selected_components))
            case "motherboard":
                filters.extend(ComponentFiltersBuilder.form_motherboard_compability_filters(self.selected_components))
            case "ram":
                filters.extend(ComponentFiltersBuilder.form_ram_compability_filters(self.selected_components))
            case "storage":
                filters.extend(ComponentFiltersBuilder.form_storage_compability_filters(self.selected_components))
            case "psu":
                filters.extend(ComponentFiltersBuilder.form_power_supply_compability_filters(self.selected_components, self.budget))
            case "case":
                filters.extend(ComponentFiltersBuilder.form_case_compability_filters(self.selected_components))

        if filters:
            stmt = stmt.where(and_(*filters))

        result = self.session.execute(stmt)
        return result.scalars().all()

    def _apply_rules(self, products: List[Product]) -> List[Product]:
        for rule in self.rules:
            products = rule.apply(products, self.component_type)
        return products

    def is_compatible(self, product: Product) -> bool:
        try:
            if self.component_type == "motherboard":
                cpu = self.selected_components.get("cpu")
                if cpu and product.motherboard_attributes.socket_type != cpu.cpu_attributes.socket_type:
                    return False

            elif self.component_type == "ram":
                cpu = self.selected_components.get("cpu")
                mb = self.selected_components.get("motherboard")
                if cpu and product.ram_attributes.ram_type != cpu.cpu_attributes.memory_type:
                    return False
                if cpu and product.ram_attributes.ram_speed > cpu.cpu_attributes.memory_speed:
                    return False
                if mb:
                    if product.ram_attributes.total_memory > mb.motherboard_attributes.max_ram_support:
                        return False
                    if product.ram_attributes.quantity > mb.motherboard_attributes.ram_slots:
                        return False

            elif self.component_type == "cpu":
                mb = self.selected_components.get("motherboard")
                if mb and product.cpu_attributes.socket_type != mb.motherboard_attributes.socket_type:
                    return False

            elif self.component_type == "case":
                gpu = self.selected_components.get("gpu")
                if gpu and product.case_attributes.cabinet_type:
                    case_limit = self._get_case_gpu_length_limit(product.case_attributes.cabinet_type)
                    if gpu.gpu_attributes.length > case_limit:
                        return False

            # PSU compatibility can use mocked logic for now:
            elif self.component_type == "psu":
                est_power = self._estimate_power_draw()
                if product.power_supply_attributes.power < est_power:
                    return False

        except Exception:
            return False

        return True

    def _get_case_gpu_length_limit(self, cabinet_type: str) -> int:
        """
        Mocked average GPU fit limit by case type.
        """
        limits = {
            "Mini ITX": 260,
            "MicroATX Mini Tower": 280,
            "MicroATX Mid Tower": 300,
            "ATX Mini Tower": 300,
            "ATX Mid Tower": 340,
            "ATX Full Tower": 400,
        }
        return limits.get(cabinet_type, 250)

    def _estimate_power_draw(self) -> int:
        """
        Estimate power needs based on budget tiers.
        """
        if self.budget < 500:
            return 500
        elif self.budget < 800:
            return 600
        elif self.budget < 1200:
            return 700
        elif self.budget < 1600:
            return 800
        else:
            return 850

    def _score(self, product: Product) -> float:
        """
        Calculate weighted score for product.
        """
        score = 0

        if self.component_type == "ram":
            score += product.ram_attributes.total_memory * 2
            score += product.ram_attributes.ram_speed * 0.1

        elif self.component_type == "cpu":
            score += product.cpu_attributes.cores * 1.5
            score += product.cpu_attributes.threads * 1.0
            score += product.cpu_attributes.turbo_speed * 2 if product.cpu_attributes.turbo_speed else 0

        elif self.component_type == "gpu":
            score += product.gpu_attributes.memory * 4
            score += product.gpu_attributes.clock_speed * 0.1 if product.gpu_attributes.clock_speed else 0

        elif self.component_type == "storage":
            score += product.storage_attributes.capacity * 0.02 if product.storage_attributes.capacity else 0
            score += 5 if product.storage_attributes.mem_type == "SSD" else 0

        elif self.component_type == "psu":
            score += product.power_supply_attributes.power * 0.05

        return score
