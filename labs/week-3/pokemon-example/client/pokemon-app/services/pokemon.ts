export interface PokemonSprites {
	front_default?: string;
	front_shiny?: string;
}

export interface IPokemon {
	id: number;
	name: string;
	height: number;
	weight: number;
	types: string[];
	abilities: string[];
	hp: number;
	attack: number;
	defense: number;
	sprites?: PokemonSprites;
}
export type PokemonResponse = { results: IPokemon[] };
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5000';
export async function getPokemon(): Promise<PokemonResponse> {
	const res = await fetch(`${API_BASE}/pokemon`);
	if (!res.ok) {
		return { results: [] };
	}
	try {
		const json: unknown = await res.json();
		// Normalize common shapes to { results: IPokemon[] }
		if (Array.isArray(json)) {
			return { results: (json as IPokemon[]).map(addSprites) };
		}
		if (json && typeof json === 'object') {
			const obj = json as { results?: unknown; data?: unknown };
			if (Array.isArray(obj.results)) {
				return { results: (obj.results as IPokemon[]).map(addSprites) };
			}
			if (Array.isArray(obj.data)) {
				return { results: (obj.data as IPokemon[]).map(addSprites) };
			}
		}
		return { results: [] };
	} catch {
		return { results: [] };
	}
}

export async function searchPokemon(query: string): Promise<PokemonResponse> {
	const q = query.trim();
	if (!q) return { results: [] };
	const url = new URL(`${API_BASE}/pokemon/search`);
	url.searchParams.set('q', q);

	const res = await fetch(url.toString());
	if (!res.ok) {
		return { results: [] };
	}
	try {
		const json: unknown = await res.json();
		if (Array.isArray(json)) {
			return { results: (json as IPokemon[]).map(addSprites) };
		}
		if (json && typeof json === 'object') {
			const obj = json as { results?: unknown; data?: unknown };
			if (Array.isArray(obj.results))
				return { results: (obj.results as IPokemon[]).map(addSprites) };
			if (Array.isArray(obj.data))
				return { results: (obj.data as IPokemon[]).map(addSprites) };
		}
		return { results: [] };
	} catch {
		return { results: [] };
	}
}

export async function getPokemonById(id: number): Promise<IPokemon | null> {
	const res = await fetch(`${API_BASE}/pokemon/${id}`);
	if (res.status === 404) return null;
	if (!res.ok) return null;
	try {
		const json: unknown = await res.json();
		if (json && typeof json === 'object') {
			const p = json as IPokemon;
			return addSprites(p);
		}
		return null;
	} catch {
		return null;
	}
}

function addSprites<T extends { id: number }>(
	p: T
): T & { sprites: PokemonSprites } {
	const id = Number(p.id);
	const base =
		'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
	return {
		...p,
		sprites: {
			front_default: `${base}/${id + 1}.png`,
			front_shiny: `${base}/shiny/${id + 1}.png`,
		},
	};
}

export default getPokemon;
