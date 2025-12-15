import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5000';

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const h = new Headers({ 'Content-Type': 'application/json' });
  if (token) h.set('Authorization', `Bearer ${token}`);
  return h;
}

export async function listFavorites(): Promise<number[]> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/me/favorites`, { headers, cache: 'no-store' });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as number[];
}

export async function addFavorite(pokemon_id: number): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/me/favorites`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ pokemon_id }),
  });
  if (res.status === 401) throw new Error('Sign in required');
  if (!res.ok) throw new Error(await res.text());
}

export async function removeFavorite(pokemon_id: number): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/me/favorites/${pokemon_id}`, {
    method: 'DELETE',
    headers,
  });
  if (res.status === 401) throw new Error('Sign in required');
  if (!res.ok) throw new Error(await res.text());
}
