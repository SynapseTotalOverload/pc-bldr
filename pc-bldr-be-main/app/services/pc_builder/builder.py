from typing import List
import logging
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.services.pc_builder.enums import COMPONENTS_ENUM
from app.services.pc_builder.rules import RuleBase, get_rules_for_purpose
from app.services.pc_builder.selector import ComponentSelector
from app.crud.product import product_crud
from app.models import Product

logger = logging.getLogger(__name__)

class PCBuilder:
    """
    Main class responsible for building a PC based on budget and usage type.
    """

    def __init__(
        self,
        budget: float,
        purpose: str,
        session: Session,
        preselected_components: dict | None = None,
    ):
        """
        :param budget: Maximum total cost of the build
        :param purpose: Use-case type, e.g., "gaming", "office", "development"
        :param session: SQLAlchemy Async session
        :param pre_selected_components: Optional dict with preselected components (e.g. {"cpu": "intel-i5-123456"})
        """
        self.budget = budget
        self.purpose = purpose
        self.session = session
        self.preselected_components: dict[str,str] = preselected_components or {}
        self.rules: List[RuleBase] = []
        self.selected_components: dict[str, Product] = {}
        self.remaining_budget = budget

    def _load_rules(self) -> None:
        """
        Load rules dynamically based on the use-case.
        """
        self.rules = get_rules_for_purpose(self.purpose)

    def build(self) -> dict[str, Product]:
        """
        Run PC building logic.
        :return: Dictionary of selected components
        """
        self._load_rules()
        selector = ComponentSelector(
            budget=self.budget,
            rules=self.rules,
            session=self.session,
            build_type=self.purpose,
            remaining_budget=self.remaining_budget,
        )
        required_components = COMPONENTS_ENUM.copy()

        self._fetch_preselected_components(required_components)
        self._check_preselected_components_compability(selector)

        self._select_reqired_components(selector, required_components)

        return self.selected_components

    def _check_preselected_components_compability(self, selector):
        selector.selected_components = self.selected_components
        for c_t, p in self.selected_components.items():
            selector.component_type = c_t
            if not selector.is_compatible(p):
                raise Exception(f"Preselected {c_t} is not compatible with other preselected components")

    def _select_reqired_components(self, selector, required_components):
        logger.info(f"Starting component selection with budget: {self.budget}, purpose: {self.purpose}")
        
        for component_type in required_components:
            logger.info(f"Selecting {component_type} with remaining budget: {self.remaining_budget:.2f}")
            
            selector.component_type = component_type
            selector.selected_components = self.selected_components
            selector.remaining_budget = self.remaining_budget
            
            product = selector.select_best()

            if not product:
                raise Exception(f"Couldn't find suitable {component_type}")
            
            # Update remaining budget after component selection
            if product.price:
                self.remaining_budget -= product.price
                logger.info(f"Selected {component_type}: {product.title} - ${product.price:.2f}, remaining budget: {self.remaining_budget:.2f}")
            else:
                logger.info(f"Selected {component_type}: {product.title} - price not available")
            
            self.selected_components[component_type] = product

    def _fetch_preselected_components(self, required_components):
        for component_type in self.preselected_components.keys():
            if component_type in COMPONENTS_ENUM:
                product = product_crud.get_by_asin(self.session, self.preselected_components[component_type])
            
            if not product:
                raise Exception(f"Couldn't find {component_type} with asin {self.preselected_components[component_type]}")
            
            # Update remaining budget for preselected components
            if product.price:
                self.remaining_budget -= product.price
            
            self.selected_components[component_type] = product
            required_components.remove(component_type)
