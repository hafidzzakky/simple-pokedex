'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SearchablePokemonSelector } from '@/components/molecules/SearchablePokemonSelector';
import { ComparisonPokemonCard } from '@/components/molecules/ComparisonPokemonCard';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface PokemonComparisonProps {
	pokemonList: DashboardPokemonDetail[];
}

export const PokemonComparison = ({ pokemonList }: PokemonComparisonProps) => {
	const [selectedId1, setSelectedId1] = useState<string>('');
	const [selectedId2, setSelectedId2] = useState<string>('');
	const defaultsApplied = useRef(false);

	useEffect(() => {
		if (!defaultsApplied.current && pokemonList.length > 0) {
			const sortedById = [...pokemonList].sort((a, b) => a.id - b.id);
			// eslint-disable-next-line react-hooks/set-state-in-effect
			if (sortedById.length > 0) setSelectedId1(sortedById[0].name);
			if (sortedById.length > 1) setSelectedId2(sortedById[1].name);
			defaultsApplied.current = true;
		}
	}, [pokemonList]);

	const pokemon1 = useMemo(() => pokemonList.find((p) => p.name === selectedId1), [pokemonList, selectedId1]);
	const pokemon2 = useMemo(() => pokemonList.find((p) => p.name === selectedId2), [pokemonList, selectedId2]);

	const comparisonData = useMemo(() => {
		if (!pokemon1 && !pokemon2) return [];

		const stats: { key: keyof DashboardPokemonDetail['stats']; name: string }[] = [
			{ key: 'hp', name: 'HP' },
			{ key: 'attack', name: 'Attack' },
			{ key: 'defense', name: 'Defense' },
			{ key: 'special-attack', name: 'Sp. Atk' },
			{ key: 'special-defense', name: 'Sp. Def' },
			{ key: 'speed', name: 'Speed' },
		];

		return stats.map((stat) => ({
			subject: stat.name,
			A: pokemon1 ? pokemon1.stats[stat.key] : 0,
			B: pokemon2 ? pokemon2.stats[stat.key] : 0,
			fullMark: 255,
		}));
	}, [pokemon1, pokemon2]);

	const sortedList = useMemo(() => {
		return [...pokemonList].sort((a, b) => a.name.localeCompare(b.name));
	}, [pokemonList]);

	return (
		<div className='bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 w-full flex flex-col h-full'>
			<h3 className='text-lg font-bold mb-6 text-center'>Pokemon Battle Simulator & Comparison</h3>

			<div className='flex flex-col lg:flex-row gap-4 flex-1 min-h-0'>
				{/* Left: Pokemon 1 Selector */}
				<div className='w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 bg-base-100/20 p-4 rounded-xl border border-white/5 order-1'>
					<SearchablePokemonSelector
						label='Player 1'
						selectedId={selectedId1}
						onSelect={setSelectedId1}
						pokemonList={sortedList}
					/>
					<ComparisonPokemonCard pokemon={pokemon1} color='primary' placeholder='Select Player 1' />
				</div>

				{/* Center: Chart */}
				<div className='flex-1 flex flex-col min-h-[300px] bg-base-100/10 rounded-xl border border-white/5 relative overflow-hidden order-3 lg:order-2'>
					{pokemon1 || pokemon2 ? (
						<ResponsiveContainer width='100%' height='100%'>
							<RadarChart cx='50%' cy='50%' outerRadius='70%' data={comparisonData}>
								<PolarGrid stroke='#ffffff20' />
								<PolarAngleAxis dataKey='subject' tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} />
								<PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
								<Tooltip
									contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
									itemStyle={{ color: '#f3f4f6' }}
								/>
								<Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
								{pokemon1 && (
									<Radar
										name={pokemon1.name}
										dataKey='A'
										stroke='#6366f1'
										strokeWidth={3}
										fill='#6366f1'
										fillOpacity={0.3}
									/>
								)}
								{pokemon2 && (
									<Radar
										name={pokemon2.name}
										dataKey='B'
										stroke='#ec4899'
										strokeWidth={3}
										fill='#ec4899'
										fillOpacity={0.3}
									/>
								)}
							</RadarChart>
						</ResponsiveContainer>
					) : (
						<div className='absolute inset-0 flex flex-col items-center justify-center text-base-content/30'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-16 w-16 mb-4 opacity-20'
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
							<p className='text-lg font-medium text-center'>Select Pokemon to Begin Simulation</p>
							<p className='text-sm opacity-60'>Compare stats side-by-side</p>
						</div>
					)}
				</div>

				{/* Right: Pokemon 2 Selector */}
				<div className='w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 bg-base-100/20 p-4 rounded-xl border border-white/5 order-2 lg:order-3'>
					<SearchablePokemonSelector
						label='Player 2'
						selectedId={selectedId2}
						onSelect={setSelectedId2}
						pokemonList={sortedList}
						align='right'
					/>
					<ComparisonPokemonCard pokemon={pokemon2} color='secondary' placeholder='Select Player 2' />
				</div>
			</div>
		</div>
	);
};
