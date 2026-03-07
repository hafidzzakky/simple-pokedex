import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DashboardPokemonDetail } from '@/types/pokemon';
import { PokeAPIPokemonResponse } from '@/types/pokeapi';
import { GEN_RANGES } from '@/utils/constants';

interface TypeStat {
	name: string;
	count: number;
	avgAttack: number;
	avgDefense: number;
	avgSpAtk: number;
	avgSpDef: number;
}

export const useDashboardData = () => {
	const [pokemonData, setPokemonData] = useState<DashboardPokemonDetail[]>([]);
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
	const [sortOrder, setSortOrder] = useState<'strongest' | 'weakest'>('strongest');
	const [selectedType, setSelectedType] = useState('');
	const [selectedGen, setSelectedGen] = useState('Gen 1');
	const [searchTerm, setSearchTerm] = useState('');
	const [fetchedGens, setFetchedGens] = useState<Set<string>>(new Set());
	const fetchingGens = useRef(new Set<string>());

	useEffect(() => {
		const fetchData = async () => {
			if (fetchedGens.has(selectedGen)) {
				setLoading(false);
				return;
			}

			if (fetchingGens.current.has(selectedGen)) {
				return;
			}

			fetchingGens.current.add(selectedGen);
			setLoading(true);
			try {
				const range = GEN_RANGES[selectedGen];
				if (!range) {
					setLoading(false);
					return;
				}

				const [startId, endId] = range;
				const limit = endId - startId + 1;
				const offset = startId - 1;

				const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
				const data = await response.json();
				const results = data.results;

				const details: DashboardPokemonDetail[] = [];
				let completed = 0;

				// Batch requests to avoid overwhelming the browser/API
				// Increased batch size for faster loading
				const BATCH_SIZE = 20;
				for (let i = 0; i < results.length; i += BATCH_SIZE) {
					const batch = results.slice(i, i + BATCH_SIZE);
					const batchPromises = batch.map(async (item: { name: string; url: string }) => {
						const res = await fetch(item.url);
						const p: PokeAPIPokemonResponse = await res.json();

						// Calculate stats
						const stats = {
							hp: p.stats[0].base_stat,
							attack: p.stats[1].base_stat,
							defense: p.stats[2].base_stat,
							'special-attack': p.stats[3].base_stat,
							'special-defense': p.stats[4].base_stat,
							speed: p.stats[5].base_stat,
						};
						const total = Object.values(stats).reduce((a, b) => a + b, 0);

						// Heuristic for Legendary status (Pseudo-legendary is usually >= 600)
						// This is a proxy since we don't want to make 151 extra calls to species endpoint
						// Mewtwo (680), Mew (600), Birds (580)
						const isLegendary = total >= 580;

						return {
							id: p.id,
							name: p.name,
							types: p.types.map((t) => t.type.name),
							stats,
							total,
							isLegendary,
							height: p.height / 10, // Convert to meters
							weight: p.weight / 10, // Convert to kg
							image: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
						};
					});

					const batchResults = await Promise.all(batchPromises);
					details.push(...batchResults);
					completed += batchResults.length;
					setProgress(Math.round((completed / limit) * 100));
				}

				setPokemonData((prev) => {
					const existingIds = new Set(prev.map((p) => p.id));
					const uniqueDetails = details.filter((d) => !existingIds.has(d.id));
					return [...prev, ...uniqueDetails];
				});
				setFetchedGens((prev) => new Set(prev).add(selectedGen));
				setLoading(false);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				setLoading(false);
			} finally {
				fetchingGens.current.delete(selectedGen);
			}
		};

		fetchData();
	}, [selectedGen, fetchedGens]);

	// --- Process Data for Visualizations ---

	const uniqueTypes = useMemo(() => {
		const types = new Set<string>();
		pokemonData.forEach((p) => p.types.forEach((t) => types.add(t)));
		return Array.from(types).sort();
	}, [pokemonData]);

	// Filter Data
	const filteredPokemonData = useMemo(() => {
		let data = pokemonData;

		if (selectedType && selectedType !== 'All Types') {
			data = data.filter((p) => p.types.includes(selectedType));
		}

		if (selectedGen !== 'All Generations') {
			const range = GEN_RANGES[selectedGen];
			if (range) {
				data = data.filter((p) => p.id >= range[0] && p.id <= range[1]);
			}
		}

		if (searchTerm) {
			const lowerTerm = searchTerm.toLowerCase();
			data = data.filter((p) => p.name.toLowerCase().includes(lowerTerm));
		}

		return data;
	}, [pokemonData, selectedType, selectedGen, searchTerm]);

	// Optimized Search Handler
	const handleSearch = useCallback((term: string) => {
		setSearchTerm(term);
	}, []);

	// Optimized Type Handler
	const handleTypeSelect = useCallback((type: string) => {
		setSelectedType(type);
	}, []);

	const handleGenSelect = useCallback((gen: string) => {
		setSelectedGen(gen);
	}, []);

	const handleSortOrderChange = useCallback((order: 'strongest' | 'weakest') => {
		setSortOrder(order);
	}, []);

	const typeStats = useMemo(() => {
		const stats: Record<string, TypeStat> = {};

		filteredPokemonData.forEach((p) => {
			p.types.forEach((t) => {
				if (!stats[t]) {
					stats[t] = { name: t, count: 0, avgAttack: 0, avgDefense: 0, avgSpAtk: 0, avgSpDef: 0 };
				}
				stats[t].count++;
				stats[t].avgAttack += p.stats.attack;
				stats[t].avgDefense += p.stats.defense;
				stats[t].avgSpAtk += p.stats['special-attack'];
				stats[t].avgSpDef += p.stats['special-defense'];
			});
		});

		return Object.values(stats)
			.map((s) => ({
				...s,
				avgAttack: Math.round(s.avgAttack / s.count),
				avgDefense: Math.round(s.avgDefense / s.count),
				avgSpAtk: Math.round(s.avgSpAtk / s.count),
				avgSpDef: Math.round(s.avgSpDef / s.count),
			}))
			.sort((a, b) => b.count - a.count); // Sort by count descending
	}, [filteredPokemonData]);

	const overallStats = useMemo(() => {
		if (filteredPokemonData.length === 0)
			return { avgTotal: 0, maxTotal: 0, avgAtk: 0, maxAtk: 0, avgDef: 0, maxDef: 0, avgSpd: 0, maxSpd: 0 };

		const sum = filteredPokemonData.reduce(
			(acc, p) => ({
				total: acc.total + p.total,
				atk: acc.atk + p.stats.attack,
				def: acc.def + p.stats.defense,
				spd: acc.spd + p.stats.speed,
			}),
			{ total: 0, atk: 0, def: 0, spd: 0 },
		);

		const max = filteredPokemonData.reduce(
			(acc, p) => ({
				total: Math.max(acc.total, p.total),
				atk: Math.max(acc.atk, p.stats.attack),
				def: Math.max(acc.def, p.stats.defense),
				spd: Math.max(acc.spd, p.stats.speed),
			}),
			{ total: 0, atk: 0, def: 0, spd: 0 },
		);

		return {
			avgTotal: Math.round(sum.total / filteredPokemonData.length),
			maxTotal: max.total,
			avgAtk: Math.round(sum.atk / filteredPokemonData.length),
			maxAtk: max.atk,
			avgDef: Math.round(sum.def / filteredPokemonData.length),
			maxDef: max.def,
			avgSpd: Math.round(sum.spd / filteredPokemonData.length),
			maxSpd: max.spd,
		};
	}, [filteredPokemonData]);

	const legendaryStats = useMemo(() => {
		const legendaryCount = filteredPokemonData.filter((p) => p.isLegendary).length;
		return [
			{ name: 'Legendary', value: legendaryCount },
			{ name: 'Non-Legendary', value: filteredPokemonData.length - legendaryCount },
		];
	}, [filteredPokemonData]);

	const topPowerful = useMemo(() => {
		return [...filteredPokemonData].sort((a, b) => b.total - a.total).slice(0, 10);
	}, [filteredPokemonData]);

	const topAttackers = useMemo(() => {
		return [...filteredPokemonData].sort((a, b) => b.stats.attack - a.stats.attack).slice(0, 10);
	}, [filteredPokemonData]);

	const topSpeedsters = useMemo(() => {
		return [...filteredPokemonData].sort((a, b) => b.stats.speed - a.stats.speed).slice(0, 10);
	}, [filteredPokemonData]);

	const typeDistribution = useMemo(() => {
		const single = filteredPokemonData.filter((p) => p.types.length === 1).length;
		const dual = filteredPokemonData.filter((p) => p.types.length === 2).length;
		return [
			{ name: 'Single Type', value: single },
			{ name: 'Dual Type', value: dual },
		];
	}, [filteredPokemonData]);

	const sortedPokemon = useMemo(() => {
		const sorted = [...filteredPokemonData].sort((a, b) => {
			if (sortOrder === 'strongest') return b.total - a.total;
			return a.total - b.total;
		});
		return sorted.slice(0, 10);
	}, [filteredPokemonData, sortOrder]);

	// Prepare data for metric sparklines
	const sparklineData = useMemo(() => typeStats.slice(0, 10).map((t) => ({ value: t.count })), [typeStats]);

	return {
		loading,
		progress,
		selectedGen,
		selectedType,
		searchTerm,
		sortOrder,
		uniqueTypes,
		pokemonData,
		filteredPokemonData,
		typeStats,
		overallStats,
		legendaryStats,
		topPowerful,
		topAttackers,
		topSpeedsters,
		typeDistribution,
		sortedPokemon,
		sparklineData,
		handleSearch,
		handleTypeSelect,
		handleGenSelect,
		handleSortOrderChange,
	};
};
