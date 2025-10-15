# core/auth.py
import os, time, json, requests, jwt
from functools import wraps
from flask import request, jsonify, g

SUPABASE_URL = os.getenv("SUPABASE_URL")
JWT_AUD = os.getenv("JWT_AUD", "authenticated")
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

_jwks_cache = {"keys": None, "ts": 0}
def _get_jwks():
    now = time.time()
    if not _jwks_cache["keys"] or now - _jwks_cache["ts"] > 300:
        r = requests.get(JWKS_URL, timeout=5)
        r.raise_for_status()
        _jwks_cache["keys"] = r.json()["keys"]
        _jwks_cache["ts"] = now
    return _jwks_cache["keys"]

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth.split(" ", 1)[1]

        try:
            header = jwt.get_unverified_header(token)
            alg = header.get("alg", "")
            if alg == "HS256":
                if not JWT_SECRET:
                    return jsonify({"error": "Server misconfigured: SUPABASE_JWT_SECRET missing"}), 500
                payload = jwt.decode(
                    token,
                    JWT_SECRET,
                    algorithms=["HS256"],
                    audience=JWT_AUD,
                    options={"verify_iss": False},
                )
            elif alg == "RS256":
                kid = header.get("kid")
                key = next((k for k in _get_jwks() if k["kid"] == kid), None)
                if not key:
                    return jsonify({"error": "No matching JWKS key"}), 401
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
                payload = jwt.decode(
                    token,
                    public_key,
                    algorithms=["RS256"],
                    audience=JWT_AUD,
                    issuer=f"{SUPABASE_URL}/auth/v1",
                    leeway=10,
                )
            else:
                return jsonify({"error": f"Unsupported JWT alg: {alg}"}), 401

            g.user_id = payload.get("sub")
            if not g.user_id:
                return jsonify({"error": "No user id in token"}), 401

        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {e}"}), 401
        except Exception as e:
            return jsonify({"error": f"Auth error: {e}"}), 401

        return f(*args, **kwargs)
    return wrapper
