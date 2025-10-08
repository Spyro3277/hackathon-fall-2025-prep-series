from dataclasses import dataclass
from typing import List 

@dataclass
class CoinDTO:
    id: int
    symbol:str
    name: str
    image_url: str
    current_price: float
    market_cap: float