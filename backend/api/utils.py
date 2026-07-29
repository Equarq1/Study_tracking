def calculate_level(xp: int) -> int:
    """Простая функция перевода XP в уровень: каждые 100 XP — новый уровень.

    Уровень 1: 0..99, уровень 2: 100..199 и т.д.
    """
    try:
        xp_val = int(xp)
    except Exception:
        xp_val = 0
    if xp_val < 0:
        xp_val = 0
    return xp_val // 100 + 1
