from fastapi import APIRouter

from app.api.v1.products import router as products_router
from app.api.v1.builds import router as builds_router
from app.api.v1.skins import router as skins_router
from app.api.v1.players import router as players_router
from app.api.v1.gear_lists import router as gear_lists_router
from app.api.v1.pc_specs_lists import router as pc_specs_lists_router
from app.api.v1.setup_streaming_lists import router as setup_streaming_lists_router
from app.api.v1.product_usage_graphs import router as product_usage_graphs_router
from app.api.v1.files import router as files_router
from app.api.v1.countries import router as countries_router
from app.api.v1.teams import router as teams_router
from app.api.v1.games import router as games_router

router = APIRouter(prefix="/v1")

router.include_router(products_router)
router.include_router(builds_router)
router.include_router(skins_router)
router.include_router(players_router)
router.include_router(gear_lists_router)
router.include_router(pc_specs_lists_router)
router.include_router(setup_streaming_lists_router)
router.include_router(product_usage_graphs_router)
router.include_router(files_router)
router.include_router(countries_router)
router.include_router(teams_router)
router.include_router(games_router)