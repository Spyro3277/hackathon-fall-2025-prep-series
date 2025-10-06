'use client';

import * as React from 'react';
import Link from 'next/link';
import { IPokemon, getPokemonById } from '@/services/pokemon';

export function PokemonCard({ pokemon }: { pokemon: IPokemon }) {
	const types = Array.isArray(pokemon.types) ? pokemon.types : [];
	const [details, setDetails] = React.useState<IPokemon | null>(null);

	React.useEffect(() => {
		let active = true;
		getPokemonById(pokemon.id).then((p) => {
			if (!active) return;
			if (p) setDetails(p);
		});
		return () => {
			active = false;
		};
	}, [pokemon.id]);

	const sprites = details?.sprites ?? pokemon.sprites;

	return (
		<Link
			href={`/pokemon/${pokemon.id}`}
			className='group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-md'>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h3 className='text-base font-semibold tracking-tight capitalize'>
						{pokemon.name}
					</h3>
					<p className='mt-1 text-xs text-muted-foreground'>ID {pokemon.id}</p>
					{(sprites?.front_default || sprites?.front_shiny) && (
						<div className='mt-2 flex items-center gap-2'>
							{sprites?.front_default && (
								<img
									src={sprites.front_default}
									alt={`${pokemon.name} sprite`}
									className='h-20 w-20 object-contain'
									loading='lazy'
									width={80}
									height={80}
								/>
							)}
							{sprites?.front_shiny && (
								<img
									src={sprites.front_shiny}
									alt={`${pokemon.name} shiny sprite`}
									className='h-20 w-20 object-contain'
									loading='lazy'
									width={80}
									height={80}
								/>
							)}
						</div>
					)}
				</div>
			</div>

			<div className='mt-3 flex flex-wrap gap-2'>
				{types.map((t) => (
					<span
						key={t}
						className='rounded-full bg-accent px-2 py-0.5 text-xs capitalize text-accent-foreground'>
						{t}
					</span>
				))}
			</div>
		</Link>
	);
}

export default PokemonCard;
