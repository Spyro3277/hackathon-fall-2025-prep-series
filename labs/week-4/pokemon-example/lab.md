# Week 4 Lab — Database + Supabase CRUD (No Auth)

## Goal

Create a **Supabase Postgres** table, wire a **server-side Supabase client**, implement a **favorites service** that does CRUD, and expose **Flask endpoints** you can test in **Postman**.


## What you’ll build

**Table:** `public.favorites`
Columns:

* `id` — `uuid` primary key, default `gen_random_uuid()`
* `pokemon_id` — `int8` not null
* `created_at` — `timestamptz` default `now()`


**Endpoints (Flask):**

1. `GET /favorites` → list all favorites
   Response: `[{ "id": "...", "pokemon_id": 25, "created_at": "..." }, ...]`
2. `POST /favorites` → add a favorite
   Body: `{ "pokemon_id": 25 }` → returns created row
3. `DELETE /favorites/<id>` → delete by id
   Response: `{ "ok": true }`


## Initial setup

### 1) Supabase: create the table

* **Table Editor → New Table**

  * Name: `favorites`
  * Columns:

    * `id` → `uuid` (primary key, default `gen_random_uuid()`)
    * `pokemon_id` → `int8` (not null)
    * `created_at` → `timestamptz` (default `now()`)

### 2) Env vars (server only)

Create `.env` next to your Flask `app.py`:

```ini
SUPABASE_URL=https://<your-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<paste service role key>
```

### 3) Install deps

```bash
pip install -r requirements.txt
```


## Project layout (server)

```
server/
  app.py
  client/
    __init__.py
    supabase_client.py      # server-side client (service role)
  service/
    __init__.py
    favorites_service.py    # CRUD on favorites
```


## Requirements (by layer)

### Client Library — `client/supabase_client.py`

* **Responsibility:** initialize a **server-side** Supabase client using env vars.
* Must read:

  * `SUPABASE_URL`
  * `SUPABASE_SERVICE_ROLE_KEY` *(server only; not exposed to frontend)*
* Create a single exported client instance usable by services.


### Service — `service/favorites_service.py`

* **Responsibility:** DB I/O and any light shaping of rows.
* **Methods (required):**

  * `list_favorites() -> list[dict]` — return all rows ordered by `created_at desc`
  * `add_favorite(pokemon_id: int) -> dict` — insert one row and return it
  * `remove_favorite(fav_id: str) -> None` — delete by primary key
* **Notes:**

  * Keep the table name in one constant, e.g., `TABLE = "favorites"`.
  * Handle empty results gracefully (return `[]` or `None` as appropriate).


### Routes (Flask) — `app.py`

* **Define thin routes** (parse → call service → return JSON):

  * `GET /favorites` → `service.list_favorites()` → return **array of rows**
  * `POST /favorites` → JSON body `{ "pokemon_id": <int> }` → `service.add_favorite(...)` → return created row with **201**
  * `DELETE /favorites/<id>` → `service.remove_favorite(id)` → return `{ "ok": true }`


## Acceptance tests (API)

Create `tests/test_favorites_api.py`:

* **Fixture:** Flask test client.
* **Tests:**

  1. **Create**
     `POST /favorites` with `{ "pokemon_id": 25 }` → `201`
     Response JSON has `id`, `pokemon_id`, `created_at`.
  2. **List**
     `GET /favorites` → `200` array, includes the created row.
  3. **Delete**
     `DELETE /favorites/<id>` → `200` `{ "ok": true }`
  4. **List again**
     `GET /favorites` → row no longer present.

## Acceptance tests (provided)

Create `tests\test_favorites.py` with the following content:

```python
import pytest
from app import app

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as c:
        yield c

def test_post_requires_pokemon_id(client):
    r = client.post("/favorites", json={})
    assert r.status_code == 400
    body = r.get_json()
    assert isinstance(body, dict)
    assert "error" in body

def test_list_returns_array(client):
    r = client.get("/favorites")
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)

def test_create_then_list_then_delete(client):
    # Create
    r = client.post("/favorites", json={"pokemon_id": 25})
    assert r.status_code == 201
    created = r.get_json()
    assert isinstance(created, dict)
    for k in ("id", "pokemon_id", "created_at"):
        assert k in created
    assert created["pokemon_id"] == 25
    fav_id = created["id"]

    # List should include the created row
    r = client.get("/favorites")
    assert r.status_code == 200
    items = r.get_json()
    assert any(it["id"] == fav_id for it in items)

    # Delete
    r = client.delete(f"/favorites/{fav_id}")
    assert r.status_code == 200
    body = r.get_json()
    assert isinstance(body, dict)
    assert body.get("ok") is True

    # List should NOT include the deleted row
    r = client.get("/favorites")
    assert r.status_code == 200
    items = r.get_json()
    assert all(it["id"] != fav_id for it in items)
```


## Running the app & tests

```bash
# run server (from your api/)
flask --app app run --reload

# run tests
pytest -q
```
