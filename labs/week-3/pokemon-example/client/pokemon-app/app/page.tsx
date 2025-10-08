import getPokemon, { PokemonResponse } from '@/services/pokemon';
import PokemonBrowser from '@/components/PokemonBrowser';

async function getData(): Promise<PokemonResponse> {
	return getPokemon();
}

export default async function Home() {
	const { results } = await getData();
	return (
		<div className='min-h-dvh text-foreground/95'>
			<div className='mx-auto max-w-6xl px-6 py-10 sm:px-8'>
				<PokemonBrowser initial={results} />
			</div>
		</div>
	);
}
