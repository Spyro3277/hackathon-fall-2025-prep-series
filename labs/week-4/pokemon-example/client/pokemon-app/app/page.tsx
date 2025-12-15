'use client';

import getPokemon, { PokemonResponse } from '@/services/pokemon';
import PokemonBrowser from '@/components/PokemonBrowser';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect, useState } from 'react';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
	const [session, setSession] = useState<any>(null);
	const [pokemon, setPokemon] = useState<any[]>([]);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
			setSession(session)
		);
		return () => listener?.subscription.unsubscribe();
	}, []);

	useEffect(() => {
		if (session) {
			getPokemon().then(({ results }) => setPokemon(results));
		}
	}, [session]);

	if (!session) {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }}  theme="dark"/>
			</div>
		);
	}

	return (
		<div className="min-h-dvh text-foreground/95">
			<div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
				<PokemonBrowser initial={pokemon} />
			</div>
		</div>
	);
}
