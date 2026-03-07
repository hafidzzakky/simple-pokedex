'use client';

import Image from 'next/image';
import { PokemonDetail as PokemonDetailType } from '@/types/pokemon';
import { motion } from 'framer-motion';
import { Ruler, Weight, Zap, Shield, BarChart3 } from 'lucide-react';

interface PokemonDetailProps {
	pokemon: PokemonDetailType;
}

const typeColors: Record<string, string> = {
	normal: 'bg-gray-400',
	fire: 'bg-orange-500',
	water: 'bg-blue-500',
	electric: 'bg-yellow-400',
	grass: 'bg-green-500',
	ice: 'bg-cyan-300',
	fighting: 'bg-red-700',
	poison: 'bg-purple-500',
	ground: 'bg-amber-600',
	flying: 'bg-indigo-400',
	psychic: 'bg-pink-500',
	bug: 'bg-lime-600',
	rock: 'bg-stone-600',
	ghost: 'bg-violet-700',
	dragon: 'bg-indigo-700',
	steel: 'bg-slate-500',
	fairy: 'bg-pink-300',
};

export const PokemonDetail = ({ pokemon }: PokemonDetailProps) => {
	const imageUrl =
		pokemon.image ||
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

	const primaryType = pokemon.types[0];
	const themeColor = typeColors[primaryType] || 'bg-gray-500';

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className='card bg-base-100/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-10 w-full border border-white/20 relative overflow-hidden'
		>
			{/* Background Decoration */}
			<div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl ${themeColor}`} />
			<div className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5 blur-3xl ${themeColor}`} />

			<div className='flex flex-col md:flex-row gap-12 relative z-10'>
				{/* Image Section */}
				<div className='w-full md:w-1/2 flex justify-center items-center'>
					<motion.div
						initial={{ rotate: -10, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
						className='relative w-72 h-72 md:w-96 md:h-96'
					>
						<div className='absolute inset-0 bg-base-200/50 rounded-full scale-90 -z-10' />
						<Image src={imageUrl} alt={pokemon.name} fill className='object-contain' priority />
					</motion.div>
				</div>

				{/* Info Section */}
				<div className='w-full md:w-1/2 flex flex-col justify-center'>
					<motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
						<div className='flex justify-between items-end mb-6'>
							<h1 className='text-5xl font-black capitalize text-base-content tracking-tight'>{pokemon.name}</h1>
							<span className='text-3xl text-base-content/20 font-mono font-bold'>
								#{String(pokemon.id).padStart(3, '0')}
							</span>
						</div>

						<div className='flex gap-3 mb-8'>
							{pokemon.types.map((type) => (
								<span
									key={type}
									className={`${typeColors[type] || 'bg-gray-400'} text-white px-6 py-2 rounded-full text-base font-bold capitalize shadow-md transform hover:scale-105 transition-transform`}
								>
									{type}
								</span>
							))}
						</div>

						<div className='grid grid-cols-2 gap-6 mb-8'>
							<div className='flex items-center gap-4 p-4 bg-base-100/50 rounded-2xl border border-base-200 shadow-sm'>
								<div className='p-3 bg-blue-100 rounded-full text-blue-600'>
									<Ruler size={24} />
								</div>
								<div>
									<span className='text-base-content/60 text-sm block'>Height</span>
									<span className='text-xl font-bold text-base-content'>{pokemon.height / 10} m</span>
								</div>
							</div>
							<div className='flex items-center gap-4 p-4 bg-base-100/50 rounded-2xl border border-base-200 shadow-sm'>
								<div className='p-3 bg-green-100 rounded-full text-green-600'>
									<Weight size={24} />
								</div>
								<div>
									<span className='text-base-content/60 text-sm block'>Weight</span>
									<span className='text-xl font-bold text-base-content'>{pokemon.weight / 10} kg</span>
								</div>
							</div>
						</div>

						<div className='mb-8'>
							<h3 className='text-lg font-bold mb-3 text-base-content flex items-center gap-2'>
								<Zap size={20} className='text-yellow-500' /> Abilities
							</h3>
							<div className='flex flex-wrap gap-3'>
								{pokemon.abilities.map((ability) => (
									<span
										key={ability}
										className='bg-base-200 border border-base-300 px-4 py-2 rounded-xl text-base-content font-medium capitalize hover:bg-base-300 transition-colors'
									>
										{ability}
									</span>
								))}
							</div>
						</div>

						{pokemon.weaknesses && pokemon.weaknesses.length > 0 && (
							<div className='mb-8'>
								<h3 className='text-lg font-bold mb-3 text-base-content flex items-center gap-2'>
									<Shield size={20} className='text-red-500' /> Weaknesses
								</h3>
								<div className='flex flex-wrap gap-3'>
									{pokemon.weaknesses.map((weakness) => (
										<span
											key={weakness}
											className={`${
												typeColors[weakness] || 'bg-gray-400'
											} bg-opacity-80 text-white px-4 py-2 rounded-xl text-sm font-bold capitalize shadow-sm`}
										>
											{weakness}
										</span>
									))}
								</div>
							</div>
						)}

						<div>
							<h3 className='text-lg font-bold mb-4 text-base-content flex items-center gap-2'>
								<BarChart3 size={20} className='text-blue-500' /> Base Stats
							</h3>
							<div className='space-y-4'>
								{pokemon.stats.map((stat, index) => (
									<div key={stat.name} className='flex items-center gap-4'>
										<span className='w-32 capitalize text-base-content/60 font-medium text-sm'>
											{stat.name.replace('-', ' ')}
										</span>
										<div className='relative flex-1 h-4 rounded-full overflow-hidden bg-base-200'>
											<div className={`absolute inset-0 ${themeColor} opacity-20`} />
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
												transition={{ delay: 0.5 + index * 0.1, duration: 1, type: 'spring' }}
												className={`h-full rounded-full ${themeColor} shadow-sm relative z-10`}
											/>
										</div>
										<span className='w-12 text-right text-sm font-bold text-base-content'>{stat.value}</span>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};
