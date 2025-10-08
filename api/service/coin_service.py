from client import CoinClient
from domain import coin
from repo import coin_repo
from dtos import CoinDTO
from typing import List

class CoinService:
    def __init__(self):
        self.client = CoinClient()
        self._repo = coin_repo.instance()

    def preload(self) -> None:
        raw = self._client.fetch()

        for p in raw:
            coin = Coin(
                id = p.get("id"),
                user_id = p.get("user_id"),
                coin_id = p.get("coin_id"),
                created_at = p.get("created_at")
            )
            self._repo.write(coin)

    def get(self, coin_id: str) -> Coin:
        return self.repo.read(coin_id)
    
    def get_all(self) -> List[CoinDTO]:
        result: List[CoinDTO] = []
        coins = self._repo.read_all()
        