import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	ScatterChart,
	Scatter,
	Legend,
} from 'recharts';
import { ChevronLeft } from 'lucide-react';

import { TechBackground } from '@/components/atoms/TechBackground';
import { DashboardControls } from '@/components/molecules/DashboardControls';
import { PokemonComparison } from '@/components/organisms/PokemonComparison';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';
import { MetricCard } from '@/components/molecules/MetricCard';
import { ChartTooltip } from '@/components/atoms/ChartTooltip';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface TypeStat {
	name: string;
	count: number;
	avgAttack: number;
	avgDefense: number;
	avgSpAtk: number;
	avgSpDef: number;
}

interface DashboardTemplateProps {
	loading: boolean;
	progress: number;
	selectedGen: string;
	selectedType: string;
	uniqueTypes: string[];
	filteredPokemonData: DashboardPokemonDetail[];
	pokemonData: DashboardPokemonDetail[]; // Needed for ScatterChart (Height vs Weight)
	typeStats: TypeStat[];
	overallStats: {
		avgTotal: number;
		maxTotal: number;
		avgAtk: number;
		maxAtk: number;
		avgDef: number;
		maxDef: number;
		avgSpd: number;
		maxSpd: number;
	};
	legendaryStats: { name: string; value: number }[];
	topPowerful: DashboardPokemonDetail[];
	topAttackers: DashboardPokemonDetail[];
	topSpeedsters: DashboardPokemonDetail[];
	typeDistribution: { name: string; value: number }[];
	sortedPokemon: DashboardPokemonDetail[];
	sparklineData: { value: number }[];
	sortOrder: 'strongest' | 'weakest';
	handleSearch: (term: string) => void;
	handleTypeSelect: (type: string) => void;
	handleGenSelect: (gen: string) => void;
	handleSortOrderChange: (order: 'strongest' | 'weakest') => void;
}

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

export const DashboardTemplate = ({
	loading,
	progress,
	selectedGen,
	selectedType,
	uniqueTypes,
	filteredPokemonData,
	pokemonData,
	typeStats,
	overallStats,
	legendaryStats,
	topPowerful,
	topAttackers,
	topSpeedsters,
	typeDistribution,
	sortedPokemon,
	sparklineData,
	sortOrder,
	handleSearch,
	handleTypeSelect,
	handleGenSelect,
	handleSortOrderChange,
}: DashboardTemplateProps) => {
	return (
		<main className='min-h-screen text-base-content relative bg-base-300/10'>
			<TechBackground />

			{/* Sticky Header */}
			<div className='sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 w-full shadow-sm'>
				<div className='container mx-auto px-4 py-4 max-w-[1600px]'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<Link href='/' className='btn btn-ghost btn-sm btn-circle'>
								<ChevronLeft className='h-6 w-6' />
							</Link>
							<div>
								<h1 className='text-2xl font-bold text-base-content'>Pokemon Analysis Dashboard</h1>
								<p className='text-xs text-base-content/60'>
									{selectedGen === 'All Generations' ? 'All Generations' : selectedGen} Analysis (
									{filteredPokemonData.length} Pokemon)
								</p>
							</div>
						</div>
						<DashboardControls
							onSearch={handleSearch}
							onTypeSelect={handleTypeSelect}
							availableTypes={uniqueTypes}
							selectedType={selectedType}
							onGenSelect={handleGenSelect}
							availableGens={['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5', 'Gen 6', 'Gen 7', 'Gen 8', 'Gen 9']}
							selectedGen={selectedGen}
							isLoading={loading}
							pokemonList={filteredPokemonData}
						/>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-6 max-w-[1600px]'>
				{loading ? (
					<div className='flex flex-col justify-center items-center h-[80vh]'>
						<div
							className='radial-progress text-primary mb-4'
							style={{ '--value': progress } as React.CSSProperties}
							role='progressbar'
						>
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
										<Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltip />} />
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
									onChange={(e) => handleSortOrderChange(e.target.value as 'strongest' | 'weakest')}
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
											<div className='w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200 relative'>
												<Image src={p.image} alt={p.name} fill className='object-cover rounded-full' sizes='48px' />
											</div>
										</div>
										<div className='flex-1'>
											<div className='font-bold capitalize text-base-content'>{p.name}</div>
											<div className='flex gap-1 mt-1'>
												{p.types.map((t) => (
													<PokemonTypeBadge key={t} type={t} className='badge badge-xs border-none' />
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
											fill='#8884d8'
											paddingAngle={5}
											dataKey='value'
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
										>
											{typeDistribution.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className='lg:col-span-2 bg-base-100/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 h-[350px] flex flex-col items-center justify-center'>
							<h3 className='text-lg font-bold mb-2 w-full text-left'>Legendary Ratio</h3>
							<div className='h-[250px] w-full relative'>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											data={legendaryStats}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={80}
											fill='#8884d8'
											paddingAngle={5}
											dataKey='value'
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
										>
											{legendaryStats.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.name === 'Legendary' ? LEGENDARY_COLOR : NON_LEGENDARY_COLOR}
												/>
											))}
										</Pie>
										<Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
										<Legend verticalAlign='bottom' height={36} />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Row 6: Comparison Tool */}
						<div className='lg:col-span-4'>
							<PokemonComparison pokemonList={pokemonData} />
						</div>
					</div>
				)}
			</div>
		</main>
	);
};
