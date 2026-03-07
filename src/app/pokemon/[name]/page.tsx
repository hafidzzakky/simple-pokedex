'use client';

import { useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPokemonDetailAsync, fetchEvolutionChainAsync } from '@/store/slices/pokemonSlice';
import { PokemonDetail } from '@/components/organisms/PokemonDetail';
import { EvolutionChain } from '@/components/organisms/EvolutionChain';
import { TechBackground } from '@/components/atoms/TechBackground';
import { PokeballLoader } from '@/components/atoms/PokeballLoader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
	params: Promise<{ name: string }>;
}

export default function PokemonDetailPage({ params }: PageProps) {
	const { name } = use(params);
	const searchParams = useSearchParams();
	const from = searchParams.get('from');
	const backHref = from === 'dashboard' ? '/dashboard' : '/';
	const backText = from === 'dashboard' ? 'Back to Dashboard' : 'Back to Pokedex';

	const dispatch = useAppDispatch();
	const { pokemonDetails, evolutionChains, loading, error } = useAppSelector((state) => state.pokemon);

	// Support both name and ID lookup
	const isId = !isNaN(Number(name));
	const pokemon = isId ? Object.values(pokemonDetails).find((p) => p.id === Number(name)) : pokemonDetails[name.toLowerCase()];

	const evolutionChain = pokemon?.evolutionChainUrl ? evolutionChains[pokemon.evolutionChainUrl] : null;

	useEffect(() => {
		if (name && !pokemon) {
			dispatch(fetchPokemonDetailAsync(name));
		}
	}, [dispatch, name, pokemon]);

	useEffect(() => {
		if (pokemon?.evolutionChainUrl && !evolutionChain) {
			dispatch(fetchEvolutionChainAsync(pokemon.evolutionChainUrl));
		}
	}, [dispatch, pokemon, evolutionChain]);

	if (loading && !pokemon) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-base-100 to-base-300'>
				<PokeballLoader />
			</div>
		);
	}

	if (error && !pokemon) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-error/10 p-4'>
				<div className='bg-base-100 p-8 rounded-2xl shadow-xl text-center max-w-md w-full'>
					<div className='text-error text-6xl mb-4'>⚠️</div>
					<h2 className='text-2xl font-bold text-base-content mb-2'>Error Loading Pokemon</h2>
					<p className='text-base-content/60 mb-6'>{error}</p>
					<Link
						href='/'
						className='btn btn-error text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30'
					>
						Return to Home
					</Link>
				</div>
			</div>
		);
	}

	if (!pokemon) return null;

	return (
		<main className='min-h-screen text-base-content relative overflow-hidden py-12 px-4 md:px-8'>
			<TechBackground />
			<div className='container mx-auto max-w-6xl relative z-10'>
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className='mb-8'>
					<Link
						href={backHref}
						className='inline-flex items-center gap-2 bg-base-100 px-5 py-3 rounded-full text-base-content font-bold hover:bg-base-200 hover:text-primary transition-all shadow-sm hover:shadow-md group border border-base-200'
					>
						<ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
						{backText}
					</Link>
				</motion.div>

				<PokemonDetail pokemon={pokemon} />

				{evolutionChain && <EvolutionChain chain={evolutionChain} />}
			</div>
		</main>
	);
}
