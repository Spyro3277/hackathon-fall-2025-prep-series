from dataclasses import dataclass
from typing import List


@dataclass
class Coin:
   "id": "...",
   "symbol": "...",
   "name": "...",
   "image_url": "...",
   "current_price": 0,
   "market_cap": 0,
   "market_cap_rank": 0,
   "total_volume": 0,
   "high_24h": 0,
   "low_24h": 0,
   "price_change_24h": 0,
   "price_change_percentage_24h": 0,
   "circulating_supply": 0