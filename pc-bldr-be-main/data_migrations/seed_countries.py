from __future__ import annotations

"""Simple seeder for the `countries` table.

Usage:
    python data_migrations/seed_countries.py               # default path ../all_coutries.txt
    python data_migrations/seed_countries.py --file path/to/file.json

The script reads a JSON mapping of ISO codes to country names and inserts them
into the `countries` table if a record with the same iso_code does not exist.

"""

import argparse
import json
import sys
from pathlib import Path

from sqlalchemy.exc import SQLAlchemyError

# Add project root to PYTHONPATH for imports
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.db.session import SessionLocal  # noqa: E402  # pylint: disable=wrong-import-position
from app.models.countries import Country  # noqa: E402  # pylint: disable=wrong-import-position


def seed_countries(json_file: Path) -> None:  # noqa: D401 - simple function
    """Reads JSON file and adds countries to DB if they don't exist."""

    if not json_file.exists():
        raise FileNotFoundError(f"File not found: {json_file}")

    with json_file.open("r", encoding="utf-8") as f:
        countries_data: dict[str, str] = json.load(f)

    db = SessionLocal()
    inserted, skipped = 0, 0

    try:
        for iso_code, name in countries_data.items():
            # Check if iso_code already exists
            exists = db.query(Country).filter_by(iso_code=iso_code).first()
            if exists:
                skipped += 1
                continue

            country = Country(name=name, iso_code=iso_code)
            db.add(country)
            inserted += 1

        db.commit()
        print(f"Inserted {inserted} countries, skipped {skipped} (already exist). ✅")
    except SQLAlchemyError as exc:
        db.rollback()
        print(f"Error during seeding: {exc}")
        raise
    finally:
        db.close()


def parse_args() -> argparse.Namespace:  # noqa: D401 - simple function
    """Parsing command line arguments."""

    parser = argparse.ArgumentParser(description="Seed countries table from JSON file")
    parser.add_argument(
        "--file",
        type=Path,
        default=PROJECT_ROOT / "all_coutries.txt",
        help="Path to JSON file with mapping of ISO codes to country names",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    seed_countries(args.file)
