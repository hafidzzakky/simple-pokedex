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
import { ArrowLeft, LayoutDashboard, Users, Home } from 'lucide-react';

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
		<main className='min-h-screen text-base-content relative py-12 px-4 md:px-8 pb-24 md:pb-12'>
			<TechBackground />
			<div className='container mx-auto max-w-6xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='mb-8 flex flex-col md:flex-row items-center justify-between gap-4 md:sticky md:top-4 md:z-50'
				>
					<Link
						href={backHref}
						className='inline-flex items-center gap-2 bg-base-100 px-5 py-3 rounded-full text-base-content font-bold hover:bg-base-200 hover:text-primary transition-all shadow-sm hover:shadow-md group border border-base-200 w-full md:w-auto justify-center md:justify-start'
					>
						<ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
						{backText}
					</Link>

					<div className='flex items-center gap-2 bg-base-100/80 backdrop-blur-md p-1.5 rounded-full border border-base-200 shadow-sm justify-center fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-xl w-auto md:static md:translate-x-0 md:shadow-sm'>
						<Link href='/' className='btn btn-ghost btn-sm rounded-full flex gap-2 items-center' title='Home'>
							<Home size={18} />
							<span className='hidden sm:inline'>Home</span>
						</Link>
						<Link href='/dashboard' className='btn btn-ghost btn-sm rounded-full flex gap-2 items-center' title='Dashboard'>
							<LayoutDashboard size={18} />
							<span className='hidden sm:inline'>Dashboard</span>
						</Link>
						<Link href='/team' className='btn btn-ghost btn-sm rounded-full flex gap-2 items-center' title='Team Builder'>
							<Users size={18} />
							<span className='hidden sm:inline'>Team Builder</span>
						</Link>
					</div>
				</motion.div>

				<PokemonDetail pokemon={pokemon} />

				{evolutionChain && <EvolutionChain chain={evolutionChain} />}
			</div>
		</main>
	);
}
