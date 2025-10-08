from dataclasses import dataclass
from typing import List


@dataclass
class Coin:
    id: int
    user_id: int
    coin_id: str
    created_at: str