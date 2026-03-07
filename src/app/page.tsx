'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllPokemonAsync, fetchTypesAsync, fetchPokemonByTypeAsync, setFilterType, setSearch } from '@/store/slices/pokemonSlice';
import { PokemonCard } from '@/components/PokemonCard';
import { Filter } from '@/components/Filter';
import { TechBackground } from '@/components/TechBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardPokemonDetail } from '@/types/pokemon';
import { GEN_RANGES } from '@/utils/constants';

export default function Home() {
	const dispatch = useAppDispatch();
	const { list, types, loading, error, filter } = useAppSelector((state) => state.pokemon);
	const [displayLimit, setDisplayLimit] = useState(20);
	const [selectedGen, setSelectedGen] = useState<string>('');

	const hasFetched = useRef(false);

	useEffect(() => {
		if (hasFetched.current) return;
		if (list.length === 0 && !loading) {
			hasFetched.current = true;
			dispatch(fetchAllPokemonAsync());
		}
		if (types.length === 0 && !loading) {
			dispatch(fetchTypesAsync());
		}
	}, [dispatch, list.length, types.length, loading]);

	const handleTypeChange = (type: string | null) => {
		dispatch(setFilterType(type));
		setDisplayLimit(20);
		if (type) {
			dispatch(fetchPokemonByTypeAsync(type));
		} else {
			dispatch(fetchAllPokemonAsync());
		}
	};

	const handleSearchChange = (value: string) => {
		dispatch(setSearch(value));
		setDisplayLimit(20);
	};

	const handleGenChange = (gen: string) => {
		setSelectedGen(gen);
		setDisplayLimit(20);
	};

	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const pokemonList = useMemo<DashboardPokemonDetail[]>(() => {
		return list.map((p) => {
			// Extract ID from URL
			const parts = p.url.split('/');
			const id = parts[parts.length - 2];
			return {
				id: parseInt(id),
				name: p.name,
				types: [], // Not available in simple list
				stats: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 },
				total: 0,
				isLegendary: false,
				height: 0,
				weight: 0,
				image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
			};
		});
	}, [list]);

	const filteredList = useMemo(() => {
		return list.filter((pokemon) => {
			const matchesSearch = pokemon.name.toLowerCase().includes(filter.search.toLowerCase());

			if (!matchesSearch) return false;

			if (selectedGen && selectedGen !== 'All Generations') {
				const range = GEN_RANGES[selectedGen];
				if (range) {
					// Extract ID from URL
					const parts = pokemon.url.split('/');
					const id = parseInt(parts[parts.length - 2]);
					if (id < range[0] || id > range[1]) return false;
				}
			}

			return true;
		});
	}, [list, filter.search, selectedGen]);

	const displayedList = useMemo(() => {
		return filteredList.slice(0, displayLimit);
	}, [filteredList, displayLimit]);

	const loadMore = useCallback(() => {
		if (isLoadingMore) return;
		setIsLoadingMore(true);
		// Simulate network delay for better UX and to prevent spam scrolling
		setTimeout(() => {
			setDisplayLimit((prev) => prev + 20);
			setIsLoadingMore(false);
		}, 1000);
	}, [isLoadingMore]);

	const observer = useRef<IntersectionObserver | null>(null);
	const lastElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (loading || isLoadingMore) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && displayedList.length < filteredList.length && !isLoadingMore) {
					loadMore();
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, isLoadingMore, displayedList.length, filteredList.length, loadMore],
	);

	const [showBackToTop, setShowBackToTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (error)
		return (
			<div className='flex justify-center items-center min-h-screen bg-error/10'>
				<div className='bg-base-100 p-8 rounded-2xl shadow-xl text-center'>
					<div className='text-error text-6xl mb-4'>⚠️</div>
					<h2 className='text-2xl font-bold text-base-content mb-2'>Oops! Something went wrong</h2>
					<p className='text-base-content/60'>{error}</p>
				</div>
			</div>
		);

	return (
		<main className='min-h-screen text-base-content relative'>
			<TechBackground />
			<div className='sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 w-full shadow-sm'>
				<div className='container mx-auto px-4 py-4 max-w-[1600px]'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-4'>
						<div className='text-center md:text-left'>
							<h1 className='text-3xl font-extrabold text-base-content tracking-tight'>Pokédex</h1>
							<p className='text-sm text-base-content/60'>Search for any Pokémon that exists on the planet</p>
						</div>
						<Link href='/dashboard' className='btn btn-primary btn-sm gap-2'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
								/>
							</svg>
							Dashboard
						</Link>
					</div>

					<Filter
						types={types}
						currentType={filter.type}
						searchValue={filter.search}
						selectedGen={selectedGen}
						onTypeChange={handleTypeChange}
						onSearchChange={handleSearchChange}
						onGenChange={handleGenChange}
						pokemonList={pokemonList}
					/>
				</div>
			</div>

			<div className='container mx-auto px-4 py-8 max-w-[1600px]'>
				{loading && list.length === 0 ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600' />
					</div>
				) : (
					<>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6'>
							<AnimatePresence mode='popLayout'>
								{displayedList.map((pokemon, index) => (
									<motion.div
										key={pokemon.name}
										layout
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: '-50px' }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
									>
										<PokemonCard name={pokemon.name} url={pokemon.url} />
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{filteredList.length === 0 && !loading && (
							<div className='text-center mt-20'>
								<p className='text-xl text-gray-400 font-medium'>No Pokémon found.</p>
							</div>
						)}

						{displayedList.length < filteredList.length && (
							<div ref={lastElementRef} className='flex justify-center items-center mt-12 py-8'>
								<div className='animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-red-600' />
							</div>
						)}
					</>
				)}

				<AnimatePresence>
					{showBackToTop && (
						<motion.button
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
							onClick={scrollToTop}
							className='fixed bottom-8 right-8 btn btn-primary btn-circle shadow-lg z-50'
							aria-label='Back to top'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 10l7-7m0 0l7 7m-7-7v18' />
							</svg>
						</motion.button>
					)}
				</AnimatePresence>
			</div>
		</main>
	);
}
