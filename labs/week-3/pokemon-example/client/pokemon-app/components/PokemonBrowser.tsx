'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IPokemon } from '@/services/pokemon';
import getPokemon, { searchPokemon } from '@/services/pokemon';
import { Button } from '@/components/ui/button';
import PokemonCard from '@/components/PokemonCard';

export default function PokemonBrowser({ initial }: { initial: IPokemon[] }) {
	const [query, setQuery] = useState('');
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [results, setResults] = useState<IPokemon[]>(initial);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const q = query.trim();
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			if (!q) {
				const { results } = await getPokemon();
				if (!cancelled) setResults(results);
				if (!cancelled) setLoading(false);
				return;
			}
			const { results } = await searchPokemon(q);
			if (!cancelled) setResults(results);
			if (!cancelled) setLoading(false);
		};

		const handle = setTimeout(run, 300);
		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, [query]);

	return (
		<div className='mx-auto w-full max-w-6xl'>
			<div className='rounded-md sticky top-0 z-10 -mx-4 mb-6 border-b bg-background/80 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<h1 className='text-xl font-semibold tracking-tight'>Pokédex</h1>
					<div className='flex items-center gap-2'>
						<div className='relative'>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder='Search name, type, ability...'
								className='h-10 w-64 rounded-md border bg-background px-3 text-sm shadow-xs outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
							/>
						</div>
						<Button
							variant={view === 'grid' ? 'default' : 'outline'}
							onClick={() => setView('grid')}>
							Grid
						</Button>
						<Button
							variant={view === 'list' ? 'default' : 'outline'}
							onClick={() => setView('list')}>
							List
						</Button>
					</div>
				</div>
			</div>

			{loading ? (
				<div className='mt-10 text-center text-sm text-muted-foreground'>
					Searching…
				</div>
			) : results.length === 0 ? (
				<div className='mt-10 text-center text-sm text-black'>
					No Pokémon found.
				</div>
			) : view === 'grid' ? (
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{results.map((p) => (
						<PokemonCard
							key={p.id}
							pokemon={p}
						/>
					))}
				</div>
			) : (
				<div className='divide-y divide-border rounded-md border border-border bg-card text-foreground/95'>
					{results.map((p) => (
						<Link
							key={p.id}
							href={`/pokemon/${p.id}`}
							className='flex items-center justify-between gap-4 p-4 hover:bg-muted/30'>
							<div className='min-w-0'>
								<div className='truncate text-sm font-medium capitalize'>
									{p.name}
								</div>
							</div>
							<div className='hidden gap-2 sm:flex'>
								{(Array.isArray(p.abilities) ? p.abilities : [])
									.slice(0, 3)
									.map((a) => (
										<span
											key={a}
											className='rounded-md border px-2 py-0.5 text-xs capitalize'>
											{a}
										</span>
									))}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
