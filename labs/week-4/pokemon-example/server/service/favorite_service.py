from supabase import Client
from typing import List, Dict, Any

from client import SupabaseClient

class FavoriteService:
    def __init__(self):
        self._client: Client = SupabaseClient
        self._table = "favorites"

    def add_favorite(self, user_id: str, pokemon_id: str) -> None:
        exists = (
            self._client.table(self._table).
            select("id").
            eq("user_id", user_id).
            eq("pokemon_id", pokemon_id).
            limit(1).
            execute()
        )

        if not exists.data:
            (
                self._client.table(self._table).
                insert(
                    {
                        "user_id": user_id,
                        "pokemon_id": pokemon_id
                    }
                ).execute()
            )

    def remove_favorite(self, user_id: str, pokemon_id: str) -> None:
        (
            self._client.table(self._table).
            delete().
            eq("user_id", user_id).
            eq("pokemon_id", pokemon_id).
            execute()
        )
    
    def list_favorites(self, user_id: str) -> List[str]:
        output: List[str] = []

        response = (
            self._client.table(self._table)
            .select("pokemon_id")
            .eq("user_id", user_id)
            .execute()
        )

        for row in response.data:
            output.append(row.get("pokemon_id"))

        return output
