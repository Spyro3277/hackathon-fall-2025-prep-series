from typing import Dict, List
from domain import Coin

class CoinRepo:
    _instance = None

    def __init__(self):
        self._coins: Dict[str, Coin] = {}

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = CoinRepo()
        return cls.instance
    
    def write(self, c: Coin) -> None:
        self._coins[c.id] = c

    def read(self, coin_id: str) -> Coin | None:
        return self._coins.get(id)
    
    def read_all(self) -> List[Coin]:
        return list(self._coins.values())

