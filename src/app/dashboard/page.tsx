'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { TechBackground } from '@/components/TechBackground';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	ScatterChart,
	Scatter,
	ZAxis,
	LineChart,
	Line,
} from 'recharts';

import { PokemonComparison } from '@/components/PokemonComparison';

// --- Types ---

interface PokemonDetail {
	name: string;
	types: string[];
	stats: {
		hp: number;
		attack: number;
		defense: number;
		'special-attack': number;
		'special-defense': number;
		speed: number;
	};
	total: number;
	isLegendary: boolean;
	height: number;
	weight: number;
	image: string;
}

interface TypeStat {
	name: string;
	count: number;
	avgAttack: number;
	avgDefense: number;
	avgSpAtk: number;
	avgSpDef: number;
}

// --- Constants ---

const COLORS = [
	'#6366f1', // Indigo
	'#8b5cf6', // Violet
	'#ec4899', // Pink
	'#f43f5e', // Rose
	'#f97316', // Orange
	'#eab308', // Yellow
	'#22c55e', // Green
	'#06b6d4', // Cyan
	'#3b82f6', // Blue
	'#a855f7', // Purple
];

const LEGENDARY_COLOR = '#8b5cf6';
const NON_LEGENDARY_COLOR = '#cbd5e1';

// --- Components ---

const MetricCard = ({ title, value, subValue, data, dataKey, color }: any) => (
	<div className='bg-base-100/40 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 flex flex-col h-full'>
		<h3 className='text-sm text-base-content/60 mb-1'>{title}</h3>
		<div className='flex items-end justify-between mb-2'>
			<span className='text-2xl font-bold'>{value}</span>
			<span className='text-xs text-base-content/50 mb-1'>{subValue}</span>
		</div>
		<div className='h-12 w-full mt-auto'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data}>
					<Line type='monotone' dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	</div>
);

export default function Dashboard() {
	const [pokemonData, setPokemonData] = useState<PokemonDetail[]>([]);
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
	const [sortOrder, setSortOrder] = useState<'strongest' | 'weakest'>('strongest');
	const [selectedType, setSelectedType] = useState('All Types');
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch Gen 1 (151) + Gen 2 (100) = 251 Pokemon for a good dataset
				const LIMIT = 151;
				const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}`);
				const data = await response.json();
				const results = data.results;

				const details: PokemonDetail[] = [];
				let completed = 0;

				// Batch requests to avoid overwhelming the browser/API
				const BATCH_SIZE = 10;
				for (let i = 0; i < results.length; i += BATCH_SIZE) {
					const batch = results.slice(i, i + BATCH_SIZE);
					const batchPromises = batch.map(async (item: { name: string; url: string }) => {
						const res = await fetch(item.url);
						const p = await res.json();

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
							name: p.name,
							types: p.types.map((t: any) => t.type.name),
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
					setProgress(Math.round((completed / LIMIT) * 100));
				}

				setPokemonData(details);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// --- Process Data for Visualizations ---

	const uniqueTypes = useMemo(() => {
		const types = new Set<string>();
		pokemonData.forEach((p) => p.types.forEach((t) => types.add(t)));
		return Array.from(types).sort();
	}, [pokemonData]);

	const filteredPokemonData = useMemo(() => {
		let data = pokemonData;

		if (selectedType !== 'All Types') {
			data = data.filter((p) => p.types.includes(selectedType));
		}

		if (debouncedSearchTerm) {
			const lowerTerm = debouncedSearchTerm.toLowerCase();
			data = data.filter((p) => p.name.toLowerCase().includes(lowerTerm));
		}

		return data;
	}, [pokemonData, selectedType, debouncedSearchTerm]);

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

	// Prepare data for metric sparklines (just simplified random-ish look or distribution)
	// Actually let's use the type distribution for the sparkline data to give it some shape
	const sparklineData = typeStats.slice(0, 10).map((t) => ({ value: t.count }));

	return (
		<main className='min-h-screen text-base-content relative bg-base-300/10'>
			<TechBackground />

			{/* Sticky Header */}
			<div className='sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 w-full shadow-sm'>
				<div className='container mx-auto px-4 py-4 max-w-[1600px]'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<Link href='/' className='btn btn-ghost btn-sm btn-circle'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
								</svg>
							</Link>
							<div>
								<h1 className='text-2xl font-bold text-base-content'>Pokemon Analysis Dashboard</h1>
								<p className='text-xs text-base-content/60'>Gen 1 Analysis (151 Pokemon)</p>
							</div>
						</div>
						{/* Filters */}
						<div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
							<input
								type='text'
								placeholder='Search Pokemon...'
								className='input input-sm input-bordered w-full md:max-w-xs bg-base-100/50'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<select
								className='select select-sm select-bordered w-full md:w-32 capitalize bg-base-100/50'
								value={selectedType}
								onChange={(e) => setSelectedType(e.target.value)}
								disabled={loading}
							>
								<option>All Types</option>
								{uniqueTypes.map((t) => (
									<option key={t} value={t}>
										{t}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-6 max-w-[1600px]'>
				{loading ? (
					<div className='flex flex-col justify-center items-center h-[80vh]'>
						<div className='radial-progress text-primary mb-4' style={{ '--value': progress } as any} role='progressbar'>
							{progress}%
						</div>
						<p className='text-base-content/60 animate-pulse'>Fetching Pokemon Data...</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{/* Row 1: Metrics */}
						<MetricCard
							title='Avg Total'
							value={overallStats.avgTotal}
							subValue={`Max: ${overallStats.maxTotal}`}
							data={sparklineData}
							dataKey='value'
							color='#6366f1'
						/>
						<MetricCard
							title='Avg Attack'
							value={overallStats.avgAtk}
							subValue={`Max: ${overallStats.maxAtk}`}
							data={sparklineData}
							dataKey='value'
							color='#ec4899'
						/>
						<MetricCard
							title='Avg Defense'
							value={overallStats.avgDef}
							subValue={`Max: ${overallStats.maxDef}`}
							data={sparklineData}
							dataKey='value'
							color='#22c55e'
						/>
						<MetricCard
							title='Avg Speed'
							value={overallStats.avgSpd}
							subValue={`Max: ${overallStats.maxSpd}`}
							data={sparklineData}
							dataKey='value'
							color='#eab308'
						/>

						{/* Row 2: Overview (Height 500px) */}
						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[500px]'>
							<h3 className='text-lg font-bold mb-4'>Most Common Types</h3>
							<div className='h-[420px] w-full -ml-4'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart layout='vertical' data={typeStats} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
										<XAxis type='number' hide />
										<YAxis dataKey='name' type='category' width={80} tick={{ fontSize: 12 }} interval={0} />
										<Tooltip
											cursor={{ fill: 'transparent' }}
											contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
										/>
										<Bar dataKey='count' fill='#6366f1' radius={[0, 4, 4, 0]}>
											{typeStats.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[500px] flex flex-col'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-bold capitalize'>
									Top 10 {selectedType === 'All Types' ? '' : selectedType} Pokemon List
								</h3>
								<select
									className='select select-sm select-bordered w-32 bg-base-100/50'
									value={sortOrder}
									onChange={(e) => setSortOrder(e.target.value as 'strongest' | 'weakest')}
								>
									<option value='strongest'>Strongest</option>
									<option value='weakest'>Weakest</option>
								</select>
							</div>
							<div className='overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar'>
								{sortedPokemon.map((p, index) => (
									<Link
										href={`/pokemon/${p.name}?from=dashboard`}
										key={p.name}
										className='flex items-center gap-4 p-3 rounded-lg bg-base-100/30 hover:bg-base-100/50 transition-all border border-white/5 cursor-pointer'
									>
										<span className='font-mono opacity-40 text-sm w-6 text-right'>#{index + 1}</span>
										<div className='avatar'>
											<div className='w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200'>
												<img src={p.image} alt={p.name} className='object-cover' />
											</div>
										</div>
										<div className='flex-1'>
											<div className='font-bold capitalize text-base-content'>{p.name}</div>
											<div className='flex gap-1 mt-1'>
												{p.types.map((t) => (
													<span key={t} className='badge badge-xs badge-ghost opacity-70'>
														{t}
													</span>
												))}
											</div>
										</div>
										<div className='flex flex-col items-end'>
											<span className='text-xs opacity-50 uppercase font-bold tracking-wider'>Power</span>
											<span
												className={`text-xl font-black ${sortOrder === 'strongest' ? 'text-primary' : 'text-secondary'}`}
											>
												{p.total}
											</span>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* Row 3: Detailed Stats (Height 400px) */}
						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4 capitalize'>
								Most Powerful {selectedType === 'All Types' ? 'All' : selectedType} Pokemon (Total Stats)
							</h3>
							<div className='h-[320px] w-full'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart layout='vertical' data={topPowerful} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
										<XAxis type='number' domain={[0, 'dataMax']} />
										<YAxis dataKey='name' type='category' width={100} tick={{ fontSize: 12 }} interval={0} />
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Bar dataKey='total' fill='#3b82f6' radius={[0, 4, 4, 0]} name='Total Stats'>
											{topPowerful.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-1 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4'>Top 10 Attack</h3>
							<div className='h-[320px] w-full -ml-4'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart layout='vertical' data={topAttackers} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
										<XAxis type='number' hide />
										<YAxis dataKey='name' type='category' width={100} tick={{ fontSize: 11 }} interval={0} />
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Bar dataKey='stats.attack' fill='#ec4899' radius={[0, 4, 4, 0]} name='Attack' />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-1 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4'>Top 10 Speed</h3>
							<div className='h-[320px] w-full -ml-4'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart layout='vertical' data={topSpeedsters} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
										<XAxis type='number' hide />
										<YAxis dataKey='name' type='category' width={100} tick={{ fontSize: 11 }} interval={0} />
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Bar dataKey='stats.speed' fill='#eab308' radius={[0, 4, 4, 0]} name='Speed' />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Row 4: Scatter Analysis (Height 400px) */}
						<div className='lg:col-span-1 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4'>Avg Attack vs Defense</h3>
							<div className='h-[320px] w-full'>
								<ResponsiveContainer width='100%' height='100%'>
									<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
										<CartesianGrid strokeDasharray='3 3' stroke='#ffffff20' />
										<XAxis
											type='number'
											dataKey='avgDefense'
											name='Avg Defense'
											unit=' pts'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Avg Defense', position: 'bottom', offset: 0 }}
										/>
										<YAxis
											type='number'
											dataKey='avgAttack'
											name='Avg Attack'
											unit=' pts'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Avg Attack', angle: -90, position: 'left' }}
										/>
										<Tooltip
											cursor={{ strokeDasharray: '3 3' }}
											contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
										/>
										<Scatter name='Types' data={typeStats} fill='#8884d8'>
											{typeStats.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Scatter>
									</ScatterChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-1 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4'>Sp. Atk vs Sp. Def</h3>
							<div className='h-[320px] w-full'>
								<ResponsiveContainer width='100%' height='100%'>
									<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
										<CartesianGrid strokeDasharray='3 3' stroke='#ffffff20' />
										<XAxis
											type='number'
											dataKey='avgSpDef'
											name='Avg Sp. Def'
											unit=' pts'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Avg Sp. Def', position: 'bottom', offset: 0 }}
										/>
										<YAxis
											type='number'
											dataKey='avgSpAtk'
											name='Avg Sp. Atk'
											unit=' pts'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Avg Sp. Atk', angle: -90, position: 'left' }}
										/>
										<Tooltip
											cursor={{ strokeDasharray: '3 3' }}
											contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
										/>
										<Scatter name='Types' data={typeStats} fill='#f43f5e'>
											{typeStats.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Scatter>
									</ScatterChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[400px]'>
							<h3 className='text-lg font-bold mb-4'>Height vs Weight Correlation</h3>
							<div className='h-[320px] w-full'>
								<ResponsiveContainer width='100%' height='100%'>
									<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
										<CartesianGrid strokeDasharray='3 3' stroke='#ffffff20' />
										<XAxis
											type='number'
											dataKey='weight'
											name='Weight'
											unit=' kg'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Weight (kg)', position: 'bottom', offset: 0 }}
										/>
										<YAxis
											type='number'
											dataKey='height'
											name='Height'
											unit=' m'
											stroke='#888'
											fontSize={12}
											label={{ value: 'Height (m)', angle: -90, position: 'left' }}
										/>
										<Tooltip
											cursor={{ strokeDasharray: '3 3' }}
											contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
										/>
										<Scatter name='Pokemon' data={pokemonData} fill='#22c55e' />
									</ScatterChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Row 5: Composition (Height 350px) */}
						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[350px] flex flex-col items-center justify-center'>
							<h3 className='text-lg font-bold mb-2 w-full text-left'>Single vs Dual Type</h3>
							<div className='h-[250px] w-full relative'>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											data={typeDistribution}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey='value'
										>
											<Cell key='single' fill='#06b6d4' />
											<Cell key='dual' fill='#f97316' />
										</Pie>
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Legend verticalAlign='bottom' height={36} />
									</PieChart>
								</ResponsiveContainer>
								{/* Center Text */}
								<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
									<div className='text-center'>
										<span className='text-xl font-bold block'>{pokemonData.length}</span>
										<span className='text-[10px] opacity-60'>Pokemon</span>
									</div>
								</div>
							</div>
						</div>

						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[350px] flex flex-col items-center justify-center'>
							<h3 className='text-lg font-bold mb-2 w-full text-left'>Legendary vs Non-Legendary</h3>
							<div className='h-[250px] w-full relative'>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											data={legendaryStats}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey='value'
										>
											<Cell key='legendary' fill={LEGENDARY_COLOR} />
											<Cell key='non-legendary' fill={NON_LEGENDARY_COLOR} />
										</Pie>
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Legend verticalAlign='bottom' height={36} />
									</PieChart>
								</ResponsiveContainer>
								{/* Center Text */}
								<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
									<div className='text-center'>
										<span className='text-2xl font-bold block'>
											{((legendaryStats[0].value / pokemonData.length) * 100).toFixed(1)}%
										</span>
										<span className='text-xs opacity-60'>Legendary</span>
									</div>
								</div>
							</div>
						</div>

						{/* Row 6: Comparison Tool */}
						<div className='lg:col-span-4 h-auto lg:h-[600px]'>
							<PokemonComparison pokemonList={pokemonData as any} />
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
