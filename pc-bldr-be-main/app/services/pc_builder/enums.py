COMPONENTS_ENUM = ["cpu", "cpu_cooler", "gpu", "motherboard", "ram", "storage", "psu", "case"]


def get_budget_distribution(build_type: str) -> dict[str, float]:
    """
    Returns percentage distribution of budget across components:
    cpu, gpu, ram, storage, psu, case, motherboard, cpu_cooler

    build_type: "gaming", "office", "development"
    """
    build_type = build_type.lower()

    distributions = {
        "gaming": {
            "cpu": 20,
            "gpu": 35,
            "ram": 10,
            "storage": 10,
            "psu": 7,
            "case": 5,
            "motherboard": 8,
            "cpu_cooler": 5,
        },
        "office": {
            "cpu": 25,
            "gpu": 5,
            "ram": 15,
            "storage": 15,
            "psu": 8,
            "case": 7,
            "motherboard": 20,
            "cpu_cooler": 5,
        },
        "development": {
            "cpu": 30,
            "gpu": 10,
            "ram": 20,
            "storage": 15,
            "psu": 7,
            "case": 5,
            "motherboard": 10,
            "cpu_cooler": 3,
        }
    }

    if build_type not in distributions:
        raise ValueError(f"Unknown build type: '{build_type}'. Choose from: gaming, office, development")

    return distributions[build_type]