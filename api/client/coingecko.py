import requests
import os
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "https://api.coingecko.com/api/v3/coins/markets")

class CoinClient:
    def fetch(slef, limit: int = 100) -> List[Dict]:
        params = {
            "limit": limit
        }

        response = requests.get(url=BASE_URL, params=params)
        response.raise_for_status()
        data: Dict = response.json()
        coins: List[Dict] = data.get("results", [])

        res: List[Dict] = []

        for idx, coin in enumerate(coins):
            payload = {
                "id": idx,
                "name": coin.get("coin_id"),
                **self._process_coin(coin.get("url"))
            }

            res.append(payload)

        return res
    
    def _process_coin(self, url: str) -> Dict:
        payload = {}

        response = requests.get(url)
        response.raise_for_status()
        data: Dict = response.json()

        payload["coin_id"] = data.get("coin_id")
        payload["id"] = data.get("id")

        types_data: List[Dict] = data.get("types")
        types = []

        for type in types_data:
            types.append(type["type"]["name"])

        payload["types"] = types

        return payload
