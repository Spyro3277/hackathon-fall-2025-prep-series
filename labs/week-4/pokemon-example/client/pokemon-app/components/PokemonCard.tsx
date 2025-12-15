'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { IPokemon, getPokemonById } from '@/services/pokemon';
import { addFavorite, removeFavorite, listFavorites } from '@/services/favorites';

export function PokemonCard({ pokemon }: { pokemon: IPokemon }) {
	const types = Array.isArray(pokemon.types) ? pokemon.types : [];
	const [details, setDetails] = React.useState<IPokemon | null>(null);
	const [favorites, setFavorites] = React.useState<number[]>([]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		let active = true;
		getPokemonById(pokemon.id).then((p) => {
			if (!active) return;
			if (p) setDetails(p);
		});
		listFavorites().then((favs) => {
			if (active) setFavorites(favs);
		  });
		return () => {
			active = false;
		};
	}, [pokemon.id]);

	const sprites = details?.sprites ?? pokemon.sprites;
	const isFav = favorites.includes(pokemon.id);

	async function toggleFavorite(e: React.MouseEvent) {
		e.preventDefault();
		setLoading(true);
		try {
		  if (isFav) {
			await removeFavorite(pokemon.id);
			setFavorites(favorites.filter((id) => id !== pokemon.id));
		  } else {
			await addFavorite(pokemon.id);
			setFavorites([...favorites, pokemon.id]);
		  }
		} finally {
		  setLoading(false);
		}
	  }

	  return (
		<Link
		  href={`/pokemon/${pokemon.id}`}
		  className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-md"
		>
		  <div className="flex items-start justify-between gap-3">
			<div>
			  <h3 className="text-base font-semibold tracking-tight capitalize">
				{pokemon.name}
			  </h3>
			  <p className="mt-1 text-xs text-muted-foreground">ID {pokemon.id}</p>
			</div>
	
			{/* Favorite Button */}
			<button
			  aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
			  onClick={toggleFavorite}
			  disabled={loading}
			  className="rounded-full p-1.5 transition hover:bg-muted"
			>
			  <Star
				className={`h-5 w-5 ${
				  isFav ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
				}`}
			  />
			</button>
		  </div>
	
		  {(sprites?.front_default || sprites?.front_shiny) && (
			<div className="mt-2 flex items-center gap-2">
			  {sprites?.front_default && (
				<img
				  src={sprites.front_default}
				  alt={`${pokemon.name} sprite`}
				  className="h-20 w-20 object-contain"
				  loading="lazy"
				  width={80}
				  height={80}
				/>
			  )}
			  {sprites?.front_shiny && (
				<img
				  src={sprites.front_shiny}
				  alt={`${pokemon.name} shiny sprite`}
				  className="h-20 w-20 object-contain"
				  loading="lazy"
				  width={80}
				  height={80}
				/>
			  )}
			</div>
		  )}
		</Link>
	  );
}

export default PokemonCard;
