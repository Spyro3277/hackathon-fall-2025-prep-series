import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPokemonById, IPokemon } from '@/services/pokemon';

const MAX_ID = 99;

export default async function PokemonDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: idParam } = await params;
	const id = Number(idParam);
	if (!Number.isFinite(id)) {
		notFound();
	}
	const p: IPokemon | null = await getPokemonById(id);
	if (!p) {
		notFound();
	}

	const types = Array.isArray(p.types) ? p.types : [];
	const abilities = Array.isArray(p.abilities) ? p.abilities : [];

	const prevDisabled = id <= 0;
	const nextDisabled = id >= MAX_ID;

	const statItems = [
		{ label: 'Height', value: p.height },
		{ label: 'Weight', value: p.weight },
		{ label: 'HP', value: p.hp },
		{ label: 'ATK', value: p.attack },
		{ label: 'DEF', value: p.defense },
	];

	return (
		<div className='min-h-dvh text-foreground/95'>
			<div className='mx-auto max-w-4xl px-6 py-10 sm:px-8'>
				<div className='sticky top-0 z-10 -mx-6 mb-6 border-b bg-black/60 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8 rounded-md'>
					<div className='mx-auto flex max-w-4xl items-center justify-between'>
						<Link
							href='/'
							className='text-sm text-muted-foreground hover:underline'>
							← Back to Pokédex
						</Link>
						<h1 className='text-xl font-semibold tracking-tight capitalize'>
							{p.name}
						</h1>
					</div>
					<div className='mx-auto mt-2 flex max-w-4xl items-center justify-between gap-2'>
						{prevDisabled ? (
							<span className='rounded-md border px-3 py-1.5 text-sm text-muted-foreground opacity-50'>
								Previous
							</span>
						) : (
							<Link
								href={`/pokemon/${id - 1}`}
								className='rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/30'>
								Previous
							</Link>
						)}
						{nextDisabled ? (
							<span className='rounded-md border px-3 py-1.5 text-sm text-muted-foreground opacity-50'>
								Next
							</span>
						) : (
							<Link
								href={`/pokemon/${id + 1}`}
								className='rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/30'>
								Next
							</Link>
						)}
					</div>
				</div>
				<div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
					<div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<h1 className='text-2xl font-semibold tracking-tight capitalize'>
								{p.name}
							</h1>
							<p className='mt-1 text-xs text-muted-foreground'>ID {p.id}</p>
							<div className='mt-3 flex items-center gap-2'>
								<div className='text-[10px] uppercase text-muted-foreground'>
									Types
								</div>
								<div className='flex flex-wrap gap-2'>
									{types.map((t) => (
										<span
											key={t}
											className='rounded-full bg-accent px-2 py-0.5 text-xs capitalize text-accent-foreground'>
											{t}
										</span>
									))}
								</div>
							</div>
						</div>
						{(p.sprites?.front_default || p.sprites?.front_shiny) && (
							<div className='flex items-center gap-4'>
								{p.sprites?.front_default && (
									<img
										src={p.sprites.front_default}
										alt={`${p.name} sprite`}
										className='h-24 w-24 object-contain'
										loading='eager'
										width={96}
										height={96}
									/>
								)}
								{p.sprites?.front_shiny && (
									<img
										src={p.sprites.front_shiny}
										alt={`${p.name} shiny sprite`}
										className='h-24 w-24 object-contain'
										loading='eager'
										width={96}
										height={96}
									/>
								)}
							</div>
						)}
					</div>

					<div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
						{statItems.map((s) => (
							<div
								key={s.label}
								className='rounded-md bg-muted p-3 text-center'>
								<div className='text-[10px] uppercase text-muted-foreground'>
									{s.label}
								</div>
								<div className='text-base font-semibold'>{s.value}</div>
							</div>
						))}
					</div>

					<div className='mt-8'>
						<h2 className='mt-4 mb-2 text-sm font-medium'>Abilities</h2>
						<div className='flex flex-wrap gap-2'>
							{abilities.length === 0 ? (
								<span className='text-xs text-muted-foreground'>
									No abilities listed.
								</span>
							) : (
								abilities.map((a) => (
									<span
										key={a}
										className='rounded-md border px-2 py-0.5 text-xs capitalize'>
										{a}
									</span>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
