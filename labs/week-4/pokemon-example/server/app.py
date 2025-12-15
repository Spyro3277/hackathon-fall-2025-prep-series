from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dtos import PokemonDTO
from service import PokemonService, FavoriteService
from typing import Dict, List
from core import require_auth

app = Flask(__name__)
CORS(app)
coin_svc = PokemonService()
coin_svc.preload()
fav_svc = FavoriteService()

@app.get("/pokemon")
def all_pokemon():
    result: List[Dict] = []
    data: List[PokemonDTO] = coin_svc.get_all()
    
    for p in data:
        result.append(p.__dict__)

    return jsonify(result), 200

@app.get("/pokemon/<int:pokemon_id>")
def pokemon_detail(pokemon_id: int):
    p = coin_svc.get(pokemon_id)
    if not p:
        return jsonify({"error": "not found"}), 404
    return jsonify(p.__dict__), 200

@app.get("/pokemon/search")
def search_pokemon():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "missing query param q"}), 400
    
    result: List[Dict] = []
    data: List[PokemonDTO] = coin_svc.search(q)
    
    for p in data:
        result.append(p.__dict__)

    return jsonify(result), 200

@app.get("/me/favorites")
@require_auth
def favorites_list():
    return jsonify(fav_svc.list_favorites(g.user_id))

@app.post("/me/favorites")
@require_auth
def favorites_add():
    pokemon_id = (request.get_json() or {}).get("pokemon_id")
    if pokemon_id is None:
        return {"error": "pokemon_id required"}, 400
    fav_svc.add_favorite(g.user_id, int(pokemon_id))
    return {"ok": True}

@app.delete("/me/favorites/<int:pokemon_id>")
@require_auth
def favorites_delete(pokemon_id: int):
    fav_svc.remove_favorite(g.user_id, pokemon_id)
    return {"ok": True}

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
