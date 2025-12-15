from flask import Flask, request, jsonify
from dtos import CoinDTO
from service import CoinService
from typing import Dict, List

app = Flask(__name__)
serive = CoinService()
service.preload()

@app.get("/coin")
def all_coin():
    result: List[Dict] = []
    data: List[CoinDTO] = service.get_all()

    for p in data:
        result.append(p.__dict__)

    print(result)

    return jsonify(result), 200

@app.get("/coin/<int:coin_id>")
def coin_detail(coin_id: int):
    p = service.get(coin_id)
    if not p:
        return jsonify({"error": "not found"}), 404
    return jsonify(p.__dict__), 200

@app.get("/coin/search")
def search_coin():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "missing query param q"}), 400
     
    result: List[Dict] = []
    data: List[CoinDTO] = service.search(q)

    for p in data:
        result.append(p.__dict__)

    return jsonify(result,200)
     
